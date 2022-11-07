import { postApiCall } from '../utils/Api';

/* eslint-disable import/prefer-default-export */
export const addProfile = async (payload) => {
  const result = await postApiCall('/signup', payload);
  return result.data;
};

/* eslint-disable import/prefer-default-export */
export const displayProfiles = async () => {
  const result = await postApiCall('/display_users');
  return result.data;
};
