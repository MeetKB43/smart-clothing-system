import { postApiCall } from '../utils/Api';

export const addNewCloth = async (payload) => {
  const result = await postApiCall('/add_new_cloth', payload);
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
