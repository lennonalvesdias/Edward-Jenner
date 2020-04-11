/* eslint-disable */
import { spinner } from '../components';
/**
 * @function ajax
 * @memberof $http
 * @private
 * @param {Object} config objeto de configuração
 * @return {Promise} retorna uma nova Promise
 * @example $http.post('http://localhost/can-open',
 * JSON.stringify(data), headers, true, 'Carregando dados').then((data) => {}).catch((err) => {});
 */
const ajax = (config) => {
  return new Promise(function (resolve, reject) {
    // ajax
    const req = new XMLHttpRequest();
    req.open(config.method, config.url);
    setHeaders(req, config.headers);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status >= 200 && req.status < 204) {
          const res = req.responseText;
          if (res) {
            controlSpinner(config.showSpinner);
            resolve(JSON.parse(res));
          } else {
            controlSpinner(config.showSpinner);
            resolve(true);
          }
        } else if (req.status === 204) {
          controlSpinner(config.showSpinner);
          resolve(req.status);
        } else if (req.status === 301) {
          window.location.href = JSON.parse(req.responseText);
        } else {
          controlSpinner(config.showSpinner);
          // error -> reject Promise
          const messageError = `ERROR: This call ${config.url} returned statusCode ${req.status}`;
          reject(messageError);
        }
      }
    };

    req.onerror = (e) => {
      reject(e);
    };

    if (config.data) req.send(config.data);
    else req.send();
  });
};

/**
 * @function controlSpinner
 * @memberof $http
 * @param {Boolean} show se true então setar para false
 */
const controlSpinner = (show) => {
  if (show) spinner.show(false);
};

/**
 * @function get
 * @memberof $http
 * @param {String} url url da requisição
 * @param {Object} headers objeto para o header da requisição
 * @param {Boolean} showSpinner mostrar spinner ao gerar requisição
 * @param {String} text mostrar texto abaixo do spinner ao gerar requisição
 * @return {Promise} retorna uma nova Promise
 * @example $http.get('http://localhost/can-open',headers, true, 'Aguarde um momento...')
 * .then(() => {}).catch((err) => {});
 */
const get = (url, headers, showSpinner = false, text) => {
  const config = {
    url: url,
    method: 'GET',
    headers: headers,
    showSpinner: showSpinner,
  };
  if (showSpinner) spinner.show(true);
  return ajax(config);
};

/**
 * @function post
 * @memberof $http
 * @param {String} url url da requisição
 * @param {Object} parameters objeto que será enviado - JSON.stringify(data)
 * @param {Object} headers objeto para o header da requisição
 * @param {Boolean} showSpinner mostrar spinner ao gerar requisição
 * @param {String} text mostrar texto abaixo do spinner ao gerar requisição
 * @return {Promise} retorna uma nova Promise
 * @example $http.post('http://localhost/', JSON.stringify(data),headers, true).then(() => {}).catch((err) => {});
 */
const post = (url, parameters, headers, showSpinner = false, text) => {
  const config = {
    url: url,
    method: 'POST',
    data: parameters,
    headers: headers,
    showSpinner: showSpinner,
  };
  if (showSpinner) spinner.show(true);
  return ajax(config);
};

/**
 * @function put
 * @memberof $http
 * @param {string} url url da requisição
 * @param {Object} parameters objeto que será enviado - JSON.stringify(data)
 * @param {Object} headers objeto para o header da requisição
 * @param {Boolean} showSpinner mostrar spinner ao gerar requisição
 * @param {string} text mostrar texto abaixo do spinner ao gerar requisição
 * @return {Promise} retorna uma nova Promise
 * @example $http.put('http://localhost/', JSON.stringify(data),headers, true).then(() => {}).catch((err) => {});
 */
const put = (url, parameters, headers, showSpinner = false, text) => {
  const config = {
    url: url,
    method: 'PUT',
    data: parameters,
    headers: headers,
    showSpinner: showSpinner,
  };
  if (showSpinner) spinner.show(true);
  return ajax(config);
};

/**
 * @function setHeaders
 * @memberof $http
 * @private
 * @param {Object} req objeto de requisição XMLHttpRequest
 * @param {Object} headers objeto que contém os headers necessários para a requisição
 * @return {Object} retorna o objeto XMLHttpRequest com os headers alterados para a requisição
 */
const setHeaders = (req, headers) => {
  if (typeof headers === 'object') {
    for (const [k, v] of Object.entries(headers)) {
      req.setRequestHeader(k, v);
    }
  }
  return req;
};

/**
 * @namespace $http
 */
export { get, post, put };
