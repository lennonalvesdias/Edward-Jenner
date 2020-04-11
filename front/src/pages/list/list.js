import './list.scss';
import { Component } from '../../@core';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class List
 * @classdesc component/class List
 */
export default class List extends Component {
  constructor(data) {
    super();
    console.log(data); // eslint-disable-line
    privateProperties.set(this, {
      _defaultSelector: 'c__list__page',
    });
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.list(_defaultSelector));
    return this.el;
  }
}
