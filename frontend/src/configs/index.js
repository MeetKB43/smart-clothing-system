import RoutePaths from './Routes';

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
    subCategories: [
      {
        name: 'T-shirt',
        id: 1,
      },
      {
        name: 'Casual shirt',
        id: 2,
      },
      {
        name: 'Formal shirt',
        id: 3,
      },
      {
        name: 'Sweaters',
        id: 4,
      },
      {
        name: 'Jacket',
        id: 5,
      },
      {
        name: 'Blazer & Coats',
        id: 6,
      },
      {
        name: 'Suits',
        id: 7,
      },
      {
        name: 'Skirts',
        id: 8,
      },
    ],
  },
  {
    name: 'Bottom Wear',
    id: 2,
    subCategories: [
      {
        name: 'Jeans',
        id: 9,
      },
      {
        name: 'Casual Trousers',
        id: 10,
      },
      {
        name: 'Formal Trousers',
        id: 11,
      },
      {
        name: 'Shorts',
        id: 12,
      },
      {
        name: 'Track pants & Joggers',
        id: 13,
      },
    ],
  },
  {
    name: 'Innerwear & Sleepwear',
    id: 3,
    subCategories: [
      {
        name: 'Briefs & Trunks',
        id: 14,
      },
      {
        name: 'Boxers',
        id: 15,
      },
      {
        name: 'Vests',
        id: 16,
      },
      {
        name: 'Sleepwear & Loungewear',
        id: 17,
      },
      {
        name: 'Thermals',
        id: 18,
      },
    ],
  },
  {
    name: 'Sports & Active wear',
    id: 4,
    subCategories: [
      {
        name: 'Active t-shirts',
        id: 19,
      },
      {
        name: 'Trackpants',
        id: 20,
      },
      {
        name: 'Swimwear',
        id: 21,
      },
    ],
  },
];

export const USER_ACTIONS = {
  TAKE_CLOTH: 1,
  PUT_WASHED_CLOTH: 2,
  PUT_UNWASHED_CLOTH: 3,
  NA_ACTION_DETECTED: 4,
};

export { RoutePaths };
