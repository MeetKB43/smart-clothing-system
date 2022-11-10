import { getApiCall, postApiCall } from '../utils/Api';

export const loginDevice = async ({ pin, deviceID }) => {
  const result = await postApiCall('/login', { pin, deviceID });
  return result.data;
};

export const registerDevice = async ({ deviceID, devicename, pin }) => {
  const result = await postApiCall('/register_device', { deviceID, devicename, pin });
  return result.data;
};

export const validateSession = async () => {
  const result = await getApiCall('/validate-session');
  return result.data;
};

export const logoutDevice = async () => {
  const result = await getApiCall('/logout');
  return result.data;
};
