import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useSelector } from '../../../store';
import { registerRoomActions } from '../../../store/registerRoom';

import Selector from '../../common/Selector';

import { largeBuildingTypeList } from '../../../lib/staticData';

import styled from 'styled-components';
import RadioGroup from '../../common/RadioGroup';
import RegisterRoomFooter from './RegisterRoomFooter';

const Container = styled.div`
  padding: 62px 30px 100px;

  .register-room-building-selector-wrapper {
    width: 320px;
    margin-bottom: 32px;
  }

  .register-room-room-type-radio {
    max-width: 485px;
    margin-bottom: 50px;
  }

  .register-room-is-setup-for-guest-radio {
    margin-bottom: 50px;
  }
`;

//* 선택 불가능 한 큰 범위 건물유형
const disabledlargeBuildingTypeOptions = ['하나를 선택해주세요.'];

//* 숙소유형 radio options
const roomTypeRadioOptions = [
  {
    label: '집 전체',
    value: 'entire',
    description:
      '게스트가 숙소 전체를 다른 사람과 공유하지 않고 단독으로 이용합니다. 일반적으로 침실, 욕실, 부엌이 포함됩니다.',
  },
  {
    label: '개인실',
    value: 'private',
    description: '게스트에게 개인 침실이 제공됩니다. 침실 이외의 공간은 공용일 수 있습니다.',
  },
  {
    label: '다인실',
    value: 'public',
    description:
      '게스트는 개인 공간 없이, 다른 사람과 함께 쓰는 침실이나 공용 공간에서 숙박합니다.',
  },
];

// 게스트만 사용하도록 만들어진 숙소인지 라이도 options
const isSetUpForGuestOptions = [
  {
    label: '예, 게스트용으로 따로 마련된 숙소입니다.',
    value: true,
  },
  {
    label: '아니요, 제 개인 물건이 속소에 잇습니다.',
    value: false,
  },
];

const RegisterRoomBuilding: React.FC = () => {
  const dispatch = useDispatch();

  const largeBuildingType = useSelector((state) => state.registerRoom.largeBuildingType);
  const buildingType = useSelector((state) => state.registerRoom.buildingType);
  const roomType = useSelector((state) => state.registerRoom.roomType);
  const isSetUpForGuest = useSelector((state) => state.registerRoom.isSetUpForGuest);

  // 모든 값이 있는지 확인하기
  const isValid = useMemo(() => {
    if (!largeBuildingType || !buildingType || !roomType || !isSetUpForGuest === null) {
      return false;
    }

    return true;
  }, [largeBuildingType, buildingType, roomType, isSetUpForGuest]);

  // 선택된 건물 유형 options
  const defailtBuildingOptions = useMemo(() => {
    switch (largeBuildingType) {
      case '아파트': {
        const { apartmentBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(apartmentBuildingTypeList[0]));

        return apartmentBuildingTypeList;
      }
      case '주택': {
        const { houstBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(houstBuildingTypeList[0]));

        return houstBuildingTypeList;
      }
      case '별채': {
        const { secondaryUnitBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(secondaryUnitBuildingTypeList[0]));

        return secondaryUnitBuildingTypeList;
      }
      case '독특한 숙소': {
        const { uniqueSpaceBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(uniqueSpaceBuildingTypeList[0]));

        return uniqueSpaceBuildingTypeList;
      }
      case 'B&B': {
        const { bnbBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(bnbBuildingTypeList[0]));

        return bnbBuildingTypeList;
      }
      case '부티크호텔': {
        const { boutiquesHotelBuildingTypeList } = require('../../../lib/staticData');

        dispatch(registerRoomActions.setBuildingType(boutiquesHotelBuildingTypeList[0]));

        return boutiquesHotelBuildingTypeList;
      }
      default:
        return [];
    }
  }, [largeBuildingType]);

  // 큰 범위 건물 유형 변경 시
  const onChangeLargeBuildingType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(registerRoomActions.setLargeBuildingType(e.target.value));
  };

  // 상세 건물 유형 변경 시
  const onChangeBuildingType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(registerRoomActions.setBuildingType(e.target.value));
  };

  // 숙소 유형 변경 시
  const onChangeRoomType = (value: string) => {
    dispatch(registerRoomActions.setRoomType(value as 'entire' | 'private' | 'public'));
  };

  // 게스트용 숙소인지 변경 시
  const onChangeIsSetUpForGuest = (value: any) => {
    dispatch(registerRoomActions.setIsSetUpForGuest(value));
  };

  return (
    <Container>
      <h2>등록할 숙소 종류는 무엇인가요?</h2>
      <h3>1단계</h3>
      <div className='register-room-building-selector-wrapper'>
        <Selector
          type='register'
          value={largeBuildingType || undefined}
          defaultValue='하나를 선택해주세요.'
          disabledOptions={disabledlargeBuildingTypeOptions}
          label='우선 범위를 좁혀볼까요?'
          options={largeBuildingTypeList}
          isValid={!!largeBuildingType}
          onChange={onChangeLargeBuildingType}
        />
      </div>
      <div className='register-room-building-selector-wrapper'>
        <Selector
          type='register'
          value={undefined}
          disabled={!buildingType}
          label='건물 유형을 선택하세요'
          options={defailtBuildingOptions}
          isValid={!!buildingType}
          onChange={onChangeBuildingType}
        />
      </div>
      {buildingType && (
        <>
          <div className='register-room-room-type-radio'>
            <RadioGroup
              label='게스트가 묵게 될 숙소 유형을 골라주세요'
              value={roomType}
              options={roomTypeRadioOptions}
              isValid={!!roomType}
              onChange={onChangeRoomType}
            />
          </div>
          <div className='register-room-is-setup-for-guest-radio'>
            <RadioGroup
              label='게스트만 사용하도록 만들어진 숙소인가요?'
              value={isSetUpForGuest}
              options={isSetUpForGuestOptions}
              isValid={isSetUpForGuest !== null}
              onChange={onChangeIsSetUpForGuest}
            />
          </div>
        </>
      )}
      <RegisterRoomFooter isValid={isValid} prevHref='/' nextHref='/room/register/bedrooms' />
    </Container>
  );
};
export default RegisterRoomBuilding;
