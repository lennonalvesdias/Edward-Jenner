import './app.scss';
import { Component, Router, setPrivateProperties } from '../../../@core';
import { STRINGS, loadPolyfills } from '../../../utils';
import { alert, content, navigation, spinner } from '../../../components';
import { routes } from './routing';

loadPolyfills();

const privateProperties = new WeakMap();
/**
 * @class App
 * @classdesc Componente principal
 * @constructs App
 */
export default class App extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'app__raio__do__bem',
    });

    this.renderCritical();
  }

  renderCritical() {
    const name = STRINGS.PROJECT_IDENTIFY;
    const body = document.querySelector('body');

    this.el = this.template('div', { id: name, class: 'logged' });
    this.el.appendChild(spinner.render());
    body.appendChild(this.el);

    spinner.show(true);
    window.spinner = spinner;
    // render spinner, after onload ok call render();
    this.render();
  }

  createChilds() {
    const { el } = this;
    setPrivateProperties(privateProperties, this, { _content: content, _navigation: navigation });
    window.alertMessage = alert;
    [alert.render(), navigation.render(), content.render()].forEach((item) => el.appendChild(item));
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
