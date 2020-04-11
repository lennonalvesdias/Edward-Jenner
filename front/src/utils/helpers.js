import { STRINGS } from '.';

const setDelay = (timer) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, timer)
  );
};

const getCookie = (cname) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
};

const storageTokens = (user) => {
  if (!user) {
    return JSON.parse(sessionStorage.getItem(`token-${STRINGS.PROJECT_IDENTIFY}`)) || false;
  }
  sessionStorage.setItem(`token-${STRINGS.PROJECT_IDENTIFY}`, JSON.stringify(user));
  return user;
};

const storageUser = (user) => {
  if (!user) {
    return JSON.parse(localStorage.getItem(STRINGS.PROJECT_IDENTIFY)) || false;
  } else {
    localStorage.setItem(STRINGS.PROJECT_IDENTIFY, JSON.stringify(user));
    return user;
  }
};

const isMobileDevice = () => {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};

const transformDateToAPI = (value) => {
  if (!value.length > 0) return '';
  const [d, m, y] = value.split('/');
  return new Date(`${y}-${m}-${d}`).toISOString();
};

const transformDateToFront = (value) => {
  if (!value.length > 0 || !value.includes('-')) return '';
  const [y, m, d] = value.split('-');
  return `${d?.split('T')[0]}/${m}/${y}`;
};

export { isMobileDevice, setDelay, storageTokens, storageUser, getCookie, transformDateToAPI, transformDateToFront };
