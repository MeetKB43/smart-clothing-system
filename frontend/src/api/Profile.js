import { postApiCall } from '../utils/Api';

export const getProfilesList = async () => {
  const result = await postApiCall('/display_users');
  return result.data;
};

export const addProfile = async (payload) => {
  const result = await postApiCall('/register_user', payload);
  return result.data;
};

export const deleteProfile = async () => {};
