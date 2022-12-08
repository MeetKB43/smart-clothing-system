import { postApiCall } from '../utils/Api';

export const addNewCloth = async (payload) => {
  const result = await postApiCall('/add_new_cloth', payload);
  return result.data;
};

export const getUserInventoryList = async ({ uID, deviceID, page }) => {
  const result = await postApiCall('/display_inventory', { uID, deviceID, page, entryPerPage: 20 });
  return result.data;
};

export const saveWashedClothesInfo = async (payload) => {
  const result = await postApiCall('/add_cloths', payload);
  return result.data;
};

export const getOverview = async (deviceID) => {
  const result = await postApiCall('/dashboard', { deviceID });
  return result.data;
};

export const saveClothesInfo = async (clothesData) => {
  const result = await postApiCall('/update-cloth-laundry-info', { clothesData });
  return result.data;
};

export const deleteCloth = async ({ RFID }) => {
  const result = await postApiCall('/delete-cloth', { RFID });
  return result.data;
};
