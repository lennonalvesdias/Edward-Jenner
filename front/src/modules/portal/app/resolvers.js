import { STRINGS, getAllAddress, getAllPhones, getList, setDelay } from '../../../utils';
import { spinner } from '../../../components';

const resolveUser = async () => {
  return new Promise((resolve) => {
    spinner.show(true);
    setDelay(1000).then(() => {
      resolve(JSON.parse(localStorage.getItem(STRINGS.PROJECT_IDENTIFY)));
      spinner.show(false);
    });
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
