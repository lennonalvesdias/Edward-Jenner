import './phones.scss';
import { breadcrumb, spinner } from '../../components';
import { Component } from '../../@core';
import { TPhone } from '../../models';
import { isMobileDevice } from '../../utils';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Phones
 * @classdesc component/class Phones
 */
export default class Phones extends Component {
  constructor(data) {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__phones',
      _defaultName: 'Telefones',
      _defaultIcon: 'icon-phone-circled',
      _phones: this.transformData(data),
      _phone: new TPhone(),
    });
  }

  buildBreadcrumb() {
    const { el } = this;
    const { _defaultName, _defaultIcon } = privateProperties.get(this);
    el.appendChild(breadcrumb.render({ name: _defaultName, icon: _defaultIcon }));
  }

  transformData(data) {
    if (!data) return [];
    return data.map((phone) => new TPhone(phone));
  }

  eventsModal(identify) {
    const { _phones, _defaultSelector, _phone } = privateProperties.get(this);
    const { contentModal } = this;

    if (identify) {
      const find = _phones.find((x) => x.number === identify);
      Object.assign(_phone, find);
      contentModal.innerHTML = template.phones(_defaultSelector, find);
    } else {
      contentModal.innerHTML = template.phones(_defaultSelector, _phone);
    }

    const buttonSend = contentModal.querySelector('.btnSend');
    buttonSend.onclick = () => {
      this.handleSend();
    };

    Array.from(contentModal.querySelectorAll('.c__input__field'))?.forEach((item) => {
      item.addEventListener('change', (evt) => {
        const property = evt.target.getAttribute('name');
        _phone[property] = evt.target.value;
        if (_phone.ddd && _phone.number) {
          buttonSend.removeAttribute('disabled');
        } else {
          buttonSend.setAttribute('disabled', true);
        }
      });
    });
  }

  handleSend() {
    const { _phone } = privateProperties.get(this);
    console.log(_phone); // eslint-disable-line
  }

  getChilds() {
    const { el } = this;

    const handleModal = (identify) => {
      this.modal = el.querySelector('.modal');
      this.contentModal = this.modal.querySelector('.modal__content');
      this.modal.classList.add('blockModal');
      if (identify) this.eventsModal(identify);
      else this.eventsModal();
    };

    const buttonOpenModal = el.querySelector('.newPhone');
    buttonOpenModal.onclick = (evt) => {
      evt.preventDefault();
      handleModal();
    };
    const buttonCloseModal = el.querySelector('.btnCloseModal');
    buttonCloseModal.onclick = (evt) => {
      evt.preventDefault();
      this.modal.classList.remove('blockModal');
    };

    Array.from(el.querySelectorAll('.btnEditar'))?.forEach((btn) => {
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        handleModal(evt.target.getAttribute('data-identify-item'));
      });
    });
  }

  render() {
    const { _defaultSelector, _phones } = privateProperties.get(this);

    this.el = this.template('div', { class: _defaultSelector }, template.initialPhones(_defaultSelector, _phones));
    if (isMobileDevice()) this.buildBreadcrumb();
    this.getChilds();
    spinner.show(false);
    return this.el;
  }
}
