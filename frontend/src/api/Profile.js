import { postApiCall } from '../utils/Api';

export const getProfilesList = async ({ deviceID }) => {
  const result = await postApiCall(`/display_users`, { deviceID });
  return result.data;
};

export const addProfile = async (payload) => {
  const result = await postApiCall('/register_user', payload);
  return result.data;
};

export const deleteProfile = async (uID) => {
  const result = await postApiCall('/delete_user', { uID });
  return result.data;
};
