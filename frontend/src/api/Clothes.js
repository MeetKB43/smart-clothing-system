import { postApiCall } from '../utils/Api';

/* eslint-disable import/prefer-default-export */
export const addNewCloth = async (payload) => {
  const result = await postApiCall('/add_new_cloth', payload);
  console.log(result.data);
  return result.data;
};
