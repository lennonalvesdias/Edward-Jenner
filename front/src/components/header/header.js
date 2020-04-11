import './header.scss';
import { Component, Router, setPrivateProperties } from '../../@core';
import { THeader } from '../../models';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Header
 * @classdesc component/class Header
 */
export default class Header extends Component {
  constructor() {
    super(new THeader());

    privateProperties.set(this, {
      _defaultSelector: 'c__header',
      _items: this.state.items,
    });
  }

  setNavigation(logged = false) {
    const { navigation } = this;
    const { _defaultSelector } = privateProperties.get(this);
    const ul = navigation.querySelector('ul');
    ul.innerHTML = '';
    ul.remove();
    this.state.logged = logged;
    setPrivateProperties(privateProperties, this, { _items: this.state.items });
    navigation.appendChild(this.template('ul', {}, template.navigation(_defaultSelector, this.state.items)));
  }

  getChilds() {
    const { _defaultSelector } = privateProperties.get(this);
    const { el } = this;

    this.btnDropdown = el.querySelector(`.${_defaultSelector}__control__navigation`);
    this.navigation = el.querySelector(`.${_defaultSelector}__navigation`);
    this.btnDropdown.onclick = (evt) => {
      evt.preventDefault();
      this.controlNavigation();
    };

    el.querySelector(`.${_defaultSelector}__logotipo`).onclick = (evt) => {
      evt.preventDefault();
      Router.routeChange('home');
    };

    Array.from(this.navigation.querySelectorAll('a'))?.forEach((item) => {
      item.onclick = (evt) => {
        evt.preventDefault();
        const route = evt.target.getAttribute('href')?.replace('#', '');
        Router.routeChange(route);
        this.controlNavigation();
      };
    });
  }

  controlNavigation() {
    const { navigation } = this;
    const { _defaultSelector } = privateProperties.get(this);

    navigation?.classList.toggle(`${_defaultSelector}__navigation--open`);
  }

  render() {
    const { _defaultSelector, _items } = privateProperties.get(this);
    this.el = this.template(
      'nav',
      {
        class: _defaultSelector,
      },
      template.header(_defaultSelector, template.navigation(_defaultSelector, _items))
    );
    window.header = this;
    this.getChilds();
    return this.el;
  }
}
