/* eslint-disable no-useless-catch */
import axios from 'axios';
import { RoutePaths } from '../configs';
import { getCurrentTimestamp } from './Datetime';

export const postApiCall = async (endpoint, data) => {
  const options = {
    url: `${process.env.REACT_APP_API_ENDPOINT}${endpoint}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Auth-Token': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
    data: data || {},
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    if (e.response.status === 401) {
      window.location.assign(RoutePaths.LOGOUT);
    }
    throw e;
  }
};

export const getApiCall = async (endpoint) => {
  const options = {
    url: `${process.env.REACT_APP_API_ENDPOINT}${endpoint}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Auth-Token': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
    data: {},
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    if (e.response.status === 401) {
      window.location.assign(RoutePaths.LOGOUT);
    }
    throw e;
  }
};

export const deleteApiCall = async (endpoint) => {
  const options = {
    url: `${process.env.REACT_APP_API_ENDPOINT}${endpoint}`,
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Auth-Token': getCurrentTimestamp(),
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
    data: {},
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    if (e.response.status === 401) {
      window.location.assign(RoutePaths.LOGOUT);
    }
    throw e;
  }
};
