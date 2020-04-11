import { NUMBERS, STRINGS, URLS, grantLogin, setDelay, storageTokens, storageUser } from '.';
import { alert } from '../components';

const maintanableAccess = async () => {
  try {
    await setDelay(NUMBERS.REFRESH_TIMER);
    await refreshAccess();
  } catch (err) {
    removeAccess();
    console.log(err); // eslint-disable-line
    return;
  }
};

const refreshAccess = async () => {
  const user = storageUser();
  const tokens = storageTokens();
  const payload = {
    username: user?.username,
    password: '',
    refreshToken: tokens?.refreshToken,
    grantType: 'refresh_token',
  };
  const authenticate = await grantLogin(payload, false);
  if (authenticate && authenticate.authenticated) {
    storageTokens(authenticate);
    maintanableAccess();
  } else {
    removeAccess();
  }
};

const removeAccess = async () => {
  alert.showMessage(2, 'Sua sessão expirou, faça login novamente');
  localStorage.removeItem(STRINGS.PROJECT_IDENTIFY);
  await setDelay(NUMBERS.DELAY_ALERT);
  window.location.href = `${URLS.LOGIN_PAGE}`;
};

export { maintanableAccess, removeAccess, refreshAccess };
