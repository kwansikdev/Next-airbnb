import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bedroomCountList } from '../lib/staticData';
import { BedType } from '../types/room';

type RegisterRoomState = {
  largeBuildingType: string | null;
  buildingType: string | null;
  roomType: string | null;
  isSetUpForGuest: boolean | null;
  maximumGuestCount: number;
  bedroomCount: number;
  bedCount: number;
  bedList: { id: number; beds: { type: BedType; count: number }[] }[];
  publicBedList: { type: BedType; count: number }[];
  bathroomCount: number;
  bathroomType: 'private' | 'public' | null;
  country: string;
  city: string;
  district: string;
  streetAddress: string;
  detailAddress: string;
  postcode: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  conveniences: string[];
  photos: string[];
  description: string;
  title: string;
  price: number;
  startDate: string | null;
  endDate: string | null;
};

const initialState: RegisterRoomState = {
  largeBuildingType: null,
  buildingType: null,
  roomType: null,
  isSetUpForGuest: null,
  // 최대 숙박 인원
  maximumGuestCount: 1,
  // 침실 개수
  bedroomCount: 0,
  // 침대 개수
  bedCount: 1,
  // 침대 유형
  bedList: [],
  // 공용공간 침대 유형
  publicBedList: [],
  bathroomCount: 1,
  bathroomType: null,
  // 국가/지역
  country: '',
  // 시/도
  city: '',
  // 시/군/구
  district: '',
  // 도로명 주소
  streetAddress: '',
  // 동호수
  detailAddress: '',
  // 우편번호
  postcode: '',
  // 위도
  latitude: 0,
  // 경도
  longitude: 0,
  // 편의 시설
  amenities: [],
  // 편의 공간
  conveniences: [],
  // 숙소 사진
  photos: [],
  // 숙소 설명
  description: '',
  // 숙소 제목
  title: '',
  // 숙소 요금
  price: 0,
  // 예약 시작 날짜
  startDate: null,
  // 예약 마감 날짜
  endDate: null,
};

const registerRoom = createSlice({
  name: 'registerRoom',
  initialState,
  reducers: {
    //* 큰 건물 유형 변경하기
    setLargeBuildingType(state, action: PayloadAction<string>) {
      if (action.payload === '') {
        state.largeBuildingType = null;
      }
      state.largeBuildingType = action.payload;

      return state;
    },
    //* 건물 유형 변경하기
    setBuildingType(state, action: PayloadAction<string>) {
      if (action.payload === '') {
        state.buildingType = null;
      }
      state.buildingType = action.payload;

      return state;
    },
    //* 숙소 유형 변경하기
    setRoomType(state, action: PayloadAction<'entire' | 'private' | 'public'>) {
      state.roomType = action.payload;

      return state;
    },
    //* '게스트용 숙소 인지' 변경하기
    setIsSetUpForGuest(state, action: PayloadAction<boolean>) {
      state.isSetUpForGuest = action.payload;

      return state;
    },
    //* 최대 숙박 인원 변경하기
    setMaximumGuestCount(state, action: PayloadAction<number>) {
      state.maximumGuestCount = action.payload;

      return state;
    },
    //* 침실 갯수 변경하기
    setBedroomCount(state, action: PayloadAction<number>) {
      const bedroomCount = action.payload;
      let { bedList } = state;

      state.bedroomCount = bedroomCount;

      if (bedroomCount < bedList.length) {
        //* 기존 침대 개수가 더 많으면 초과부분 잘라내기
        bedList = state.bedList.slice(0, bedroomCount);
      } else {
        //* 변경될 침대 개수가 더 많으면 나머지 침실 채우기
        for (let i = bedList.length + 1; i < bedroomCount + 1; i += 1) {
          bedList.push({ id: i, beds: [] });
        }
      }

      state.bedList = bedList;

      return state;
    },
    //* 최대 침대 갯수 변경하기
    setBedCount(state, action: PayloadAction<number>) {
      state.bedCount = action.payload;

      return state;
    },
    //* 침대 유형 갯수 변경하기
    setBedTypeCount(
      state,
      action: PayloadAction<{ bedroomId: number; type: BedType; count: number }>,
    ) {
      const { bedroomId, type, count } = action.payload;

      const bedroom = state.bedList[bedroomId - 1];

      const prevBeds = bedroom.beds;
      const index = prevBeds.findIndex((bed) => bed.type === type);

      if (index === -1) {
        //* 타입이 없다면
        state.bedList[bedroomId - 1].beds = [...prevBeds, { type, count }];

        return state;
      }

      //* 타입이 존재한다면
      if (count === 0) {
        state.bedList[bedroomId - 1].beds.splice(index, 1);
      } else {
        state.bedList[bedroomId - 1].beds[index].count = count;
      }

      return state;
    },
    setPublicBedTypeCount(state, action: PayloadAction<{ type: BedType; count: number }>) {
      const { type, count } = action.payload;

      const index = state.publicBedList.findIndex((bed) => bed.type === type);
      if (index === -1) {
        //* 타입이 없다면
        state.publicBedList = [...state.publicBedList, { type, count }];
        return state;
      }
      //* 타입이 존재한다면
      if (count === 0) {
        state.publicBedList.splice(index, 1);
      } else {
        state.publicBedList[index].count = count;
      }
      return state;
    },
    setBathroomCount(state, action: PayloadAction<number>) {
      state.bathroomCount = action.payload;
    },
    setBathroomType(state, action: PayloadAction<'private' | 'public'>) {
      state.bathroomType = action.payload;
    },
    setCountry(state, action: PayloadAction<string>) {
      state.country = action.payload;
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setDistrict(state, action: PayloadAction<string>) {
      state.district = action.payload;
    },
    setStreetAddress(state, action: PayloadAction<string>) {
      state.streetAddress = action.payload;
    },
    setDetailAddress(state, action: PayloadAction<string>) {
      state.detailAddress = action.payload;
    },
    setPostcode(state, action: PayloadAction<string>) {
      state.postcode = action.payload;
    },
    setLatitude(state, action: PayloadAction<number>) {
      state.latitude = action.payload;
    },
    setLongitude(state, action: PayloadAction<number>) {
      state.longitude = action.payload;
    },
    setAmenities(state, action: PayloadAction<string[]>) {
      state.amenities = action.payload;
    },
    setConveniences(state, action: PayloadAction<string[]>) {
      state.conveniences = action.payload;
    },
    setPhotos(state, action: PayloadAction<string[]>) {
      state.photos = action.payload;
    },
    // 숙소 설명
    setDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    // 숙소 제목
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    // 숙소 요금
    setPrice(state, action: PayloadAction<number>) {
      state.price = action.payload;
    },
    setStartDate(state, action: PayloadAction<string | null>) {
      state.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<string | null>) {
      state.endDate = action.payload;
    },
  },
});

export const registerRoomActions = { ...registerRoom.actions };

export default registerRoom;
