import { setPrivateProperties } from '../@core';

const privateProperties = new WeakMap();
export default class THeader {
  constructor(logged = false) {
    privateProperties.set(this, {
      _logged: logged,
    });
    this.buildItems();
  }

  set logged(logged = false) {
    setPrivateProperties(privateProperties, this, { _logged: logged });
    this.buildItems();
    return;
  }

  buildItems() {
    const { _logged } = privateProperties.get(this);
    if (!_logged) this.items = dontLogged;
    else this.items = logged;
  }
}

const logged = [
  {
    name: 'Perfil',
    icon: 'icon-user-circle-o',
    route: 'profile',
  },
  {
    name: 'Listas',
    icon: 'icon-docs',
    route: 'list',
    default: true,
  },
  {
    name: 'Mapa',
    icon: 'icon-location-7',
    route: 'map',
  },
];

const dontLogged = [
  {
    name: 'Educação',
    icon: 'icon-book-open',
    route: 'education',
  },
  {
    name: 'Cadastro',
    icon: 'icon-user-add-outline',
    route: 'register',
  },
  {
    name: 'Login',
    icon: 'icon-login-1',
    route: 'login',
  },
];
