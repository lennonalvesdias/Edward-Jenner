import { STRINGS, URLS } from './constants';
import { getAddressWithCEP, getAllAddress, getAllPhones, getList, getUser, grantLogin, registerUser } from './requests';
import {
  getCookie,
  isMobileDevice,
  setDelay,
  setUserTokens,
  storageUser,
  transformDateToAPI,
  transformDateToFront,
} from './helpers';
import { loadPolyfills } from './polyfills';

export {
  STRINGS,
  URLS,
  loadPolyfills,
  getCookie,
  isMobileDevice,
  setDelay,
  setUserTokens,
  storageUser,
  transformDateToAPI,
  transformDateToFront,
  grantLogin,
  getAllAddress,
  getAllPhones,
  getAddressWithCEP,
  getList,
  getUser,
  registerUser,
};
