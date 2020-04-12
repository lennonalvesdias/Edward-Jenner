import './list.scss';
import { Component } from '../../@core';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class List
 * @classdesc component/class List
 */
export default class List extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__list__page',
    });
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);
    const mockItems = [
      {
        id: 1,
        nome: 'Item y',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
      {
        id: 2,
        nome: 'Item x',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
      {
        id: 2,
        nome: 'Item x',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
      {
        id: 1,
        nome: 'Item y',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
      {
        id: 2,
        nome: 'Item x',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
      {
        id: 2,
        nome: 'Item x',
        quantidade: 12,
        precoMaximo: 30.5,
        categoria: '',
      },
    ];

    this.el = this.template('div', { class: _defaultSelector }, template.list(_defaultSelector, mockItems));
    return this.el;
  }
}
