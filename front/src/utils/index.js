import { NUMBERS, STRINGS, URLS } from './constants';
import { getAddressWithCEP, getAllAddress, getAllPhones, getList, getUser, grantLogin, registerUser } from './requests';
import {
  getCookie,
  isMobileDevice,
  setDelay,
  storageTokens,
  storageUser,
  transformDateToAPI,
  transformDateToFront,
} from './helpers';
import { maintanableAccess, refreshAccess, removeAccess } from './maintanableAccess';
import { loadPolyfills } from './polyfills';

export {
  NUMBERS,
  STRINGS,
  URLS,
  loadPolyfills,
  maintanableAccess,
  refreshAccess,
  removeAccess,
  getCookie,
  isMobileDevice,
  setDelay,
  storageTokens,
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
