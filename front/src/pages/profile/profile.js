import './profile.scss';
import { Address, Notfound, Phones } from '..';
import { Component, Router, setPrivateProperties } from '../../@core';
import { isMobileDevice, storageUser } from '../../utils';
import UserProfile from '../user-profile/user-profile';
import { spinner } from '../../components';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Profile
 * @classdesc component/class Profile
 */
export default class Profile extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__profile',
      _user: storageUser(),
      _pages: pages,
    });
  }

  navigationEventHandlers() {
    const { el } = this;
    const { _contentPages, _pages } = privateProperties.get(this);

    Array.from(el.querySelectorAll('a'))?.forEach((item) => {
      item.addEventListener(
        'click',
        /* eslint-disable-line */ function (evt) {
          evt.preventDefault();
          const route = this.getAttribute('href')?.replace('#', '');
          if (isMobileDevice()) {
            if (route) Router.routeChange(route);
          } else {
            _contentPages.innerHTML = '';
            const find = _pages.find((x) => x.route === route);
            if (find) _contentPages.appendChild(new find.page().render());
            else _contentPages.appendChild(new Notfound());
          }
        }
      );
    });
  }

  preparePages() {
    const { _defaultSelector, _pages } = privateProperties.get(this);
    const { el } = this;
    const _contentPages = el.querySelector(`.${_defaultSelector}__content__pages`);

    _contentPages.appendChild(new _pages[0].page().render());
    setPrivateProperties(privateProperties, this, { _contentPages, _pages });
  }

  render() {
    const { _defaultSelector, _user, _pages } = privateProperties.get(this);
    spinner.show(false);
    this.el = this.template('div', { class: _defaultSelector }, template.profile(_defaultSelector, _user, _pages));
    if (!isMobileDevice()) this.preparePages();
    this.navigationEventHandlers();
    return this.el;
  }
}

// pages navigation
const pages = [
  {
    route: 'profile-user',
    name: 'Dados pessoais',
    icon: 'icon-user-circle',
    page: UserProfile,
  },
  {
    route: 'profile-address',
    name: 'Endereços',
    icon: 'icon-location-circled',
    page: Address,
  },
  {
    route: 'profile-phones',
    name: 'Telefones',
    icon: 'icon-phone-circled',
    page: Phones,
  },
  // {
  //   route: 'profile-rating',
  //   name: 'Avaliações',
  //   icon: 'icon-star-circled',
  //   page: {},
  // },
];
