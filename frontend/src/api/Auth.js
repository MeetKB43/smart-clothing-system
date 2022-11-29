import { getApiCall, postApiCall } from '../utils/Api';

export const loginDevice = async ({ pin, deviceID }) => {
  const result = await postApiCall('/login', { pin, deviceID });
  return result.data;
};

export const registerDevice = async ({
  deviceID,
  devicename,
  pin,
  city = 'Windsor',
  lat = 1234,
  long = 1234,
}) => {
  const result = await postApiCall('/register_device', {
    deviceID,
    devicename,
    pin,
    city,
    lat,
    long,
  });
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

export const createGoogleTokens = async (code, deviceID) => {
  const result = await postApiCall('/suggestClothes', { code, deviceID });
  return result.data;
};
