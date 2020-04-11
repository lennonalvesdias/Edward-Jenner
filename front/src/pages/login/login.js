/* eslint-disable */
import './login.scss';
import { Component } from '../../@core';
import { grantLogin, storageTokens, storageUser, getUser, transformDateToFront } from '../../utils';
import { TUser } from '../../models';
import { alert } from '../../components';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Login
 * @classdesc component/class Login
 */
export default class Login extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__login',
      _model: new TUser(),
    });
  }

  getChilds() {
    const { el } = this;
    const { _model } = privateProperties.get(this);

    const button = el.querySelector('button');
    button?.addEventListener('click', async (evt) => {
      evt.preventDefault();
      this.login();
    });

    Array.from(el.querySelectorAll('input'))?.forEach((input) => {
      input.addEventListener('change', (evt) => {
        const property = evt.target.name;
        _model[property] = evt.target.value;
        if (_model.username && _model.password) button?.removeAttribute('disabled');
        else button?.setAttribute('disabled', true);
      });
    });
  }

  async login() {
    const { _model } = privateProperties.get(this);
    const objectToSend = {
      username: _model.username,
      password: _model.password,
      grantType: 'password',
    };
    const response = await grantLogin(objectToSend);
    if (response && response.authenticated) {
      storageTokens(response);
      this.loadUser();
    } else {
      alert.showMessage(1, 'Não foi possível fazer login.<br/>Confirme seus dados para tentar novamente');
    }
  }

  async loadUser() {
    const { _model } = privateProperties.get(this);
    const user = await getUser(_model.username);
    if (user) {
      user.birthday = transformDateToFront(user.birthday);
      user.logged = true;
      storageUser(new TUser(user));
      window.location.href = 'portal/';
      return;
    }
    alert.showMessage(1, 'Não foi possível carregar seus dados no momento');
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.login(_defaultSelector));
    this.getChilds();
    return this.el;
  }
}
