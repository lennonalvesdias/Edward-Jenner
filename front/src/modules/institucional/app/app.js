import './app.scss';
import { Router, setPrivateProperties } from '../../../@core';
import { STRINGS, loadPolyfills, setDelay } from '../../../utils';
import { alert, content, header, spinner } from '../../../components';
import { routes } from './routing';
import template from './template.js';

loadPolyfills();

const privateProperties = new WeakMap();
/**
 * @class App
 * @classdesc Componente principal
 * @constructs App
 */
export default class App {
  constructor(options = {}) {
    privateProperties.set(this, {
      _defaultSelector: 'app__raio__do__bem',
      _injectInto: options.injectInto || document.querySelector('body'),
    });

    this.renderCritical();
  }

  renderCritical() {
    // TODO - spinner
    const { _injectInto } = privateProperties.get(this);
    const name = STRINGS.PROJECT_IDENTIFY;

    _injectInto.innerHTML = template.app(name);
    this.el = _injectInto.querySelector(`#${name}`);

    this.el.appendChild(spinner.render());
    spinner.show(true);
    setDelay(1000).then(() => {
      spinner.show(false);
    });
    window.spinner = spinner;
    // render spinner, after onload ok call render();
    this.render();
  }

  createChilds() {
    const { el } = this;
    setPrivateProperties(privateProperties, this, { _header: header, _content: content });
    window.alertMessage = alert;
    [alert.render(), header.render(), content.render()].forEach((item) => el.appendChild(item));
  }

  /**
   * @description Este método é responsável por renderizar o projeto
   * @memberof App
   * @function render
   * @example var app = new App;
   * app.render();
   */
  render() {
    this.createChilds();
    const { _content } = privateProperties.get(this);
    Router.forRoot(routes, _content);
  }
}
