import './register.scss';
import { Component, Router } from '../../@core';
import { registerUser, setDelay, transformDateToAPI } from '../../utils';
import { TUser } from '../../models';
import { alert } from '../../components';

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

    const buttons = el.querySelectorAll('.btnSend');
    const stateButtonControl = (state = false) => {
      Array.from(buttons)?.forEach((button) => {
        if (!state) button.setAttribute('disabled', true);
        else button.removeAttribute('disabled');
      });
    };

    Array.from(buttons)?.forEach((button) => {
      button.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.register();
      });
    });

    Array.from(el.querySelectorAll('input'))?.forEach((element) => {
      element.addEventListener('change', (evt) => {
        const property = evt.target.name;
        _model[property] = evt.target.value;

        if (_model.name && _model.email && _model.password && _model.typeUser && _model.birthday && _model.username)
          stateButtonControl(true);
        else stateButtonControl(false);
      });
    });
  }

  async register() {
    const { _model } = privateProperties.get(this);
    const response = await registerUser({
      ..._model,
      type: _model._type,
      birthday: transformDateToAPI(_model.birthday),
    });
    if (response) {
      alert.showMessage(0, 'Usuário cadastrado com sucesso');
      await setDelay(2000);
      Router.routeChange('login');
    } else {
      alert.showMessage(1, 'Ocorreu um erro ao fazer o seu cadastro.');
    }
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.register(_defaultSelector));

    this.getChilds();
    return this.el;
  }
}
