import './register.scss';
import { registerUser, storageUser } from '../../utils';
import { Component } from '../../@core';
import { TUser } from '../../models';

import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Register
 * @classdesc component/class Register
 */
export default class Register extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__register',
      _model: new TUser(),
    });
  }

  getChilds() {
    const { _model } = privateProperties.get(this);
    const { el } = this;

    this.button = el.querySelector('button');
    this.button.addEventListener('click', async () => {
      const response = await registerUser(_model);
      if (response) {
        _model.logged = true;
        storageUser(_model);
        window.router.routeChange('welcome');
      } else {
        console.log('HERE'); // eslint-disable-line
      }
    });

    Array.from(el.querySelectorAll('input'))?.forEach((element) => {
      element.addEventListener('change', (evt) => {
        const property = evt.target.name;
        _model[property] = evt.target.value;

        if (_model.name && _model.email && _model.password && _model.typeUser) this.button.removeAttribute('disabled');
        else this.button.setAttribute('disabled', true);
      });
    });
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.register(_defaultSelector));

    this.getChilds();
    return this.el;
  }
}
