import './user-profile.scss';
import { breadcrumb, spinner } from '../../components';
import { isMobileDevice, storageUser } from '../../utils';
import { Component } from '../../@core';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class User-profile
 * @classdesc component/class User-profile
 */
export default class UserProfile extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__user-profile',
      _defaultName: 'Dados pessoais',
      _defaultIcon: 'icon-user-circle',
      _user: storageUser(),
    });
  }

  buildBreadcrumb() {
    const { el } = this;
    const { _defaultName, _defaultIcon } = privateProperties.get(this);
    el.appendChild(breadcrumb.render({ name: _defaultName, icon: _defaultIcon }));
  }

  render() {
    const { _defaultSelector, _user } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.userProfile(_defaultSelector, _user));
    if (isMobileDevice()) this.buildBreadcrumb();
    spinner.show(false);
    return this.el;
  }
}
