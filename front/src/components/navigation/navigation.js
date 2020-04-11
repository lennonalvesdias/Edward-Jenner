import './navigation.scss';
import { Component, Router } from '../../@core';
import { THeader } from '../../models';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Navigation
 * @classdesc component/class Navigation
 */
export default class Navigation extends Component {
  constructor() {
    super(new THeader(true));
    privateProperties.set(this, {
      _defaultSelector: 'c__navigation',
      _items: this.state.items,
    });
  }

  getChilds() {
    const { el } = this;
    Array.from(el.querySelectorAll('a'))?.forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        const route = this.getAttribute('href')?.replace('#', '');
        if (route) Router.routeChange(route);
      });
    });
  }

  render() {
    const { _defaultSelector, _items } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.navigation(_defaultSelector, _items));
    this.getChilds();
    return this.el;
  }
}
