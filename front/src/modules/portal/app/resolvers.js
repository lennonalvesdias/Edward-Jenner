import { STRINGS, getAllAddress, getAllPhones, getList } from '../../../utils';

const resolveUser = async () => {
  return new Promise((resolve) => {
    window.spinner?.show(true);
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem(STRINGS.PROJECT_IDENTIFY)));
      window.spinner.show(false);
    }, 1000);
  });
};

const resolveList = async () => {
  const request = await getList();
  if (!request) return false;
  return request;
};

const resolveAddresses = async () => {
  const request = await getAllAddress();
  return request;
};

const resolvePhones = async () => {
  const request = await getAllPhones();
  if (!request) return false;
  return request;
};

export { resolveUser, resolveAddresses, resolvePhones, resolveList };
