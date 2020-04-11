import { STRINGS, URLS, getCookie, storageUser } from '.';
import { get, post } from './service';

const headers = {
  'Content-Type': 'application/json',
};

const grantLogin = async (user, showSpinner = true) => {
  try {
    const url = `${URLS.API_PATH}/api/login`;
    return await post(url, JSON.stringify(user), headers, showSpinner);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const getUser = async (username) => {
  try {
    const headers = {
      Authorization: `Bearer ${getCookie(STRINGS.USER_TOKEN_NAME)}`,
    };
    const url = `${URLS.API_PATH}/user/username/${username}`;
    return await get(url, headers, true);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const registerUser = async (user) => {
  try {
    const url = `${URLS.API_PATH}/user`;
    return await post(url, JSON.stringify(user), headers, true);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const getAddressWithCEP = async (cep = '') => {
  try {
    const header = {
      'Content-Type': 'application/json',
    };
    const url = `${URLS.API_CEP}`.replace('##replaceCEP##', cep);
    return await get(url, header, true);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const getAllAddress = async () => {
  const user = storageUser();
  if (!user) return false;
  try {
    headers['Authorization'] = `Bearer ${user.id}`;
    const url = `${URLS.API_PATH}/addresses`;
    return await get(url, headers, true);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const getAllPhones = async () => {
  const user = storageUser();
  if (!user) return false;
  try {
    headers['Authorization'] = `Bearer ${user.id}`;
    const url = `${URLS.API_PATH}/phones`;
    return await get(url, headers, true);
  } catch (err) {
    console.log(err); // eslint-disable-line
    return false;
  }
};

const getList = async () => {
  const user = storageUser();
  if (!user) return false;
  try {
    const header = {
      Authorization: `Bearer ${user.id}`,
      ...headers,
    };
    const url = `${URLS.API_PATH}/list`;
    return await get(url, header, true);
  } catch (err) {
    console.log(err); //eslint-disable-line
    return false;
  }
};

export { getAddressWithCEP, getAllAddress, getAllPhones, getList, getUser, grantLogin, registerUser };
