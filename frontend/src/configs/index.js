import RoutePaths from './Routes';
import blazer from '../assets/images/blazer.png';
import bottomWear from '../assets/images/bottom_wear.png';
import casualShirt from '../assets/images/casual_shirt.png';
import formalShirt from '../assets/images/formal_shirt.png';
import innerWear from '../assets/images/inner_wear.png';
import jacket from '../assets/images/jacket.png';
import joggers from '../assets/images/joggers.png';
import topWear from '../assets/images/top_wear.png';
import tshirt from '../assets/images/t_shirt.png';
import trousers from '../assets/images/trousers.png';
import sweaters from '../assets/images/sweaters.png';
import skirt from '../assets/images/skirt.png';
import sportsWear from '../assets/images/sport_wear.png';
import suit from '../assets/images/suit.png';
import shorts from '../assets/images/shorts.png';
import innerShorts from '../assets/images/inner_shorts.png';

export const NAV_DRAWER_WIDTH = 256;
export const APP_BAR_HEIGHT = 56;

export const DT_PAGE_SIZE = 15;

export const DataStatus = {
  1: 'Active',
  Active: 1,
  ACTIVE: 1,
  2: 'Inactive',
  Inactive: 2,
  INACTIVE: 2,
  3: 'Deleted',
  Deleted: 3,
  DELETED: 3,
};

export const ClothCategories = [
  {
    name: 'Top Wear',
    id: 1,
    image: topWear,
    subCategories: [
      {
        name: 'T-shirt',
        image: tshirt,
        id: 1,
      },
      {
        name: 'Casual shirt',
        image: casualShirt,
        id: 2,
      },
      {
        name: 'Formal shirt',
        image: formalShirt,
        id: 3,
      },
      {
        name: 'Sweaters',
        image: sweaters,
        id: 4,
      },
      {
        name: 'Jacket',
        image: jacket,
        id: 5,
      },
      {
        name: 'Blazer & Coats',
        image: blazer,
        id: 6,
      },
      {
        name: 'Suits',
        image: suit,
        id: 7,
      },
      {
        name: 'Skirts',
        image: skirt,
        id: 8,
      },
    ],
  },
  {
    name: 'Bottom Wear',
    id: 2,
    image: bottomWear,
    subCategories: [
      {
        name: 'Jeans',
        image: bottomWear,
        id: 9,
      },
      {
        name: 'Casual Trousers',
        image: trousers,
        id: 10,
      },
      {
        name: 'Formal Trousers',
        image: trousers,
        id: 11,
      },
      {
        name: 'Shorts',
        image: shorts,
        id: 12,
      },
      {
        name: 'Track pants & Joggers',
        image: joggers,
        id: 13,
      },
    ],
  },
  {
    name: 'Innerwear & Sleepwear',
    id: 3,
    image: innerWear,
    subCategories: [
      {
        name: 'Briefs & Trunks',
        image: innerWear,
        id: 14,
      },
      {
        name: 'Boxers',
        image: innerShorts,
        id: 15,
      },
      {
        name: 'Vests',
        image: innerWear,
        id: 16,
      },
      {
        name: 'Sleepwear & Loungewear',
        image: innerWear,
        id: 17,
      },
      {
        name: 'Thermals',
        image: innerWear,
        id: 18,
      },
    ],
  },
  {
    name: 'Sports & Active wear',
    id: 4,
    image: sportsWear,
    subCategories: [
      {
        name: 'Active t-shirts',
        image: sportsWear,
        id: 19,
      },
      {
        name: 'Trackpants',
        image: sportsWear,
        id: 20,
      },
      {
        name: 'Swimwear',
        image: sportsWear,
        id: 21,
      },
    ],
  },
];

export const getCategoryName = (catId) => {
  const catDetails = ClothCategories.filter((c) => c.id === catId);
  return catDetails.length > 0 ? catDetails[0].name : 'NA';
};

export const getSubCategoryName = (catId, subCatId) => {
  const catDetails = ClothCategories.filter((c) => c.id === catId);
  if (catDetails.length > 0) {
    const subCatDetails = catDetails[0].subCategories.filter((c) => c.id === subCatId);
    return subCatDetails.length > 0 ? subCatDetails[0].name : 'NA';
  }
  return 'NA';
};

export const USER_ACTIONS = {
  ADD_NEW_CLOTH: 0,
  TAKE_CLOTH: 1,
  PUT_WASHED_CLOTH: 2,
  PUT_UNWASHED_CLOTH: 3,
  NA_ACTION_DETECTED: 4,
};

export const RFID_PACKET_TYPE = {
  ADD_NEW_CLOTH: 0,
  PUT_CLOTH: 1,
  TAKE_CLOTH: 2,
};

export const LAUNDRY_STATE = {
  NA: 0,
  WASHED: 1,
  UNWASHED: 2,
};

export { RoutePaths };
