import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import useDebounce from '../../../hooks/useDebounce';
import { getPlaceAPI, searchPlacesAPI } from '../../../lib/api/map';
import { useSelector } from '../../../store';
import { searchRoomActions } from '../../../store/searchRoom';
import palette from '../../../styles/palette';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    border-color: ${palette.gray_dd};
  }

  .search-room-bar-location-texts {
    position: absolute;
    top: 16px;
    left: 20px;
    width: calc(100% - 40px);

    .search-room-bar-location-label {
      margin-bottom: 4px;
      font-size: 10px;
      font-weight: 800;
    }

    input {
      width: 100%;
      border: 0;
      outline: none;
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &::placeholder {
        opacity: 0.7;
        font-size: 14px;
      }
    }
  }

  .search-room-bar-location-results {
    position: absolute;
    top: 78px;
    background-color: #fff;
    width: 500px;
    padding: 16px 0;
    border-radius: 32px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    overflow: hidden;
    z-index: 10;

    li {
      display: flex;
      align-items: center;
      height: 64px;
      padding: 8px 32px;
      cursor: pointer;

      &:hover {
        background-color: ${palette.gray_f7};
      }
    }
  }
`;

const SearchRoomBarLocation: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.searchRoom.location);
  const searchKeyword = useDebounce(location, 500);

  const [popupOpened, setPopupOpened] = useState(false);
  const [results, setResults] = useState<
    {
      description: string;
      placeId: string;
    }[]
  >([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // ?????? ?????? dispatch
  const setLocationDispatch = (value: string) => {
    dispatch(searchRoomActions.setLocation(value));
  };

  // ?????? ?????? dispatch
  const setLatitudeDispatch = (value: number) => {
    dispatch(searchRoomActions.setLatitude(value));
  };

  // ?????? ?????? dispatch
  const setLongitudeDispatch = (value: number) => {
    dispatch(searchRoomActions.setlongitude(value));
  };

  const onClickInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setPopupOpened(true);
  };

  const searchPlaces = async () => {
    try {
      const { data } = await searchPlacesAPI(encodeURI(location));

      setResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  // ?????? ?????? ?????? ?????? ???
  const onClickNearPlaces = () => {
    setPopupOpened(false);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocationDispatch('?????? ?????? ??????');
        setLatitudeDispatch(coords.latitude);
        setLongitudeDispatch(coords.longitude);
      },
      (e) => {
        console.log(e);
      },
    );
  };

  // ????????? ?????? ?????? ???
  const onClickResult = async (placeId: string) => {
    try {
      const { data } = await getPlaceAPI(placeId);
      setLocationDispatch(data.location);
      setLatitudeDispatch(data.latitude);
      setLongitudeDispatch(data.longitude);
    } catch (e) {
      console.log(e);
    }
  };

  // ???????????? ????????? ????????? ??????
  useEffect(() => {
    if (!searchKeyword) {
      setResults([]);
    }

    if (searchKeyword) {
      // ?????? ????????????
      searchPlaces();
    }
  }, [searchKeyword]);

  return (
    <Container onClick={onClickInput}>
      <OutsideClickHandler onOutsideClick={() => setPopupOpened(false)}>
        <div className='search-room-bar-location-texts'>
          <p className='search-room-bar-location-label'>??????</p>
          <input
            ref={inputRef}
            value={location}
            placeholder='????????? ?????? ??????????'
            onChange={(e) => setLocationDispatch(e.target.value)}
          />
        </div>
        {popupOpened && (
          <ul className='search-room-bar-location-results'>
            {!location && (
              <li role='presentation' onClick={onClickNearPlaces}>
                ?????? ?????? ??????
              </li>
            )}
            {!isEmpty(results) &&
              results.map((result, index) => (
                <li key={index} onClick={() => onClickResult(result.placeId)}>
                  {result.description}
                </li>
              ))}
            {location && isEmpty(results) && <li>?????? ????????? ????????????.</li>}
          </ul>
        )}
      </OutsideClickHandler>
    </Container>
  );
};

export default SearchRoomBarLocation;
