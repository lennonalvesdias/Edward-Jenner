import { memoizeDOMManipulation } from './cacheItensNavigation';
import { setPrivateProperties } from '../_shared';

const privateProperties = new WeakMap();

export default class CoreRouter {
  constructor() {
    privateProperties.set(this, {
      id: 0,
      _content: {},
      _contentChildren: {},
      _routes: [],
      _routesChildren: [],
    });
    window.onpopstate = () => {
      this.controlHistoryPopState();
    };
  }

  forRoot(_routes = [], _content) {
    setPrivateProperties(privateProperties, this, { _content, _routes });
    this.getInitialRoute();
  }

  forChildren(_routesChildren = [], _contentChildren = {}) {
    setPrivateProperties(privateProperties, this, { _routesChildren, _contentChildren });
    this.getInitialRoute();
  }

  setContent(content = {}) {
    setPrivateProperties(privateProperties, this, { _content: content });
    this.getInitialRoute();
  }

  getInitialRoute() {
    let route = window.location.href.split('#');
    if (route.length > 1) {
      this.routeChange(route[1], true);
    } else {
      this.routeChange('', true);
    }
  }

  async routeChange(originalRoute = '', pop = false) {
    const { _content, _routes } = privateProperties.get(this);
    const splitRoute = originalRoute.split('/');
    const route = splitRoute[0];
    const property = splitRoute[1];
    const valueFilter = splitRoute[2];
    const component = _routes.find((x) => x.path === route);
    let page;
    this.controlActiveLinks(route);

    if (!component) throw Error('Not found page');

    this.controlHistoryPushState(route, pop);

    if ('guard' in component) {
      page = await this.applyGuard(component, property, valueFilter);
    } else if ('resolve' in component) {
      page = await this.applyResolve(component, property, valueFilter);
    } else {
      page = new component.page();
    }

    if (!page) {
      throw Error('Not found page');
    }
    _content.route(page);
  }

  async applyResolve(component, property, valueQuery) {
    try {
      const response = await component.resolve();
      if (property && valueQuery) {
        const findChildren = component.children.find((x) => x.path === property);
        return new findChildren.page(response, valueQuery);
      }
      return new component.page(response);
    } catch (err) {
      console.log(err); // eslint-disable-line
      return false;
      //_content.route(new PageError());
    }
  }

  async applyGuard(component, property, valueQuery) {
    const { _routes } = privateProperties.get(this);
    try {
      if (!component.guard()) {
        window.location.href = _routes.find((x) => x.path === '**').page;
        return false;
      }
      if ('resolve' in component) {
        return await this.applyResolve(component, property, valueQuery);
      }
      return new component.page();
    } catch (err) {
      console.log(err); // eslint-disable-line
      return false;
    }
  }

  controlActiveLinks(route = '') {
    const elements = memoizeDOMManipulation(document, 'querySelectorAll', '[data-router-link]');
    elements.forEach((item) => {
      const href = item.getAttribute('href');
      const defaultRouter = item.getAttribute('data-router-default');
      if (route === '' && defaultRouter === 'true') {
        item.classList.add('router-active');
      }
      if (route !== '') {
        if (!route.search(href) > -1) item.classList.remove('router-active');
        if (route.search(href) > -1) item.classList.add('router-active');
      }
    });
  }

  controlHistoryPushState(route, pop) {
    const splitUrl = window.location.href.split('#');

    if (route === '/') return window.location.href.split('#')[0];

    let count = privateProperties.get(this)['id'] + 1;
    setPrivateProperties(privateProperties, this, { id: count });

    if (!pop) window.history.pushState({ route, id: count }, document.title, `${splitUrl[0]}#${route}`);
  }

  controlHistoryPopState() {
    const state = window.history.state;
    if (!state) this.routeChange('');
    else this.routeChange(state.route, true);
  }
}
