import { postApiCall } from '../utils/Api';

/* eslint-disable import/prefer-default-export */
export const addNewCloth = async ({ uID, cType, RFID, deviceID }) => {
  const result = await postApiCall('/add_new_cloth', { uID, cType, RFID, deviceID });
  return result.data;
};

export const getUserInventoryList = async ({ uID, deviceID }) =>
  new Array(10).fill(undefined).map((c, i) => ({
    uID,
    category: `Category ${i}`,
    subCategory: `Sub Category ${i}`,
    deviceID,
  }));

export const deleteCloth = async () => {};
