import './address.scss';
import { Component, setPrivateProperties } from '../../@core';
import { alert, breadcrumb, spinner } from '../../components';
import { getAddressWithCEP, isMobileDevice } from '../../utils';
import { TAddress } from '../../models';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Address
 * @classdesc component/class Address
 */
export default class Address extends Component {
  constructor(data) {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__address',
      _defaultName: 'Endereços',
      _defaultIcon: 'icon-location-circled',
      _addresses: this.transformData(data),
      _address: new TAddress(),
    });
  }

  buildBreadcrumb() {
    const { el } = this;
    const { _defaultName, _defaultIcon } = privateProperties.get(this);
    el.appendChild(breadcrumb.render({ name: _defaultName, icon: _defaultIcon }));
  }

  transformData(data) {
    if (!data) return [];
    return data.map((address) => new TAddress(address));
  }

  handleEventsModal(evt) {
    const { _defaultSelector, _addresses } = privateProperties.get(this);
    const { modal, contentModal, btnCloseModal } = this;

    const closeModal = () => {
      this.modal.classList.remove('blockModal');
    };

    btnCloseModal.onclick = (evt) => {
      evt.preventDefault();
      closeModal();
    };

    const cep = evt.target.getAttribute('data-identify-item');
    let address;
    if (cep) {
      address = _addresses.find((x) => x.cep === Number(cep));
    } else {
      address = new TAddress();
    }

    contentModal.innerHTML = template.address(_defaultSelector, address);
    this.eventsForm();
    modal.classList.add('blockModal');
  }

  eventsForm() {
    const { _address } = privateProperties.get(this);
    const { el } = this;

    const fieldCEP = el.querySelector('[name="cep"]');
    const buttonSend = el.querySelector('.btnSendAddress');

    fieldCEP.addEventListener('change', async (evt) => {
      evt.preventDefault();
      this.getCEP(evt.target);
    });

    Array.from(el.querySelectorAll('.c__input__field'))?.forEach((item) => {
      item.addEventListener('change', (evt) => {
        _address[evt.target.getAttribute('name')] = evt.target.value;
        setPrivateProperties(privateProperties, this, { _address });
        this.checkModelToSend(buttonSend);
      });
    });
  }

  checkModelToSend(button) {
    const { street, number, neighborhood, state, country, type } = privateProperties.get(this)['_address'];

    if (street && number && neighborhood && state && country && type) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', true);
    }
  }

  getChilds() {
    const { el } = this;

    const newAddress = el.querySelector('.newAddress');
    this.modal = el.querySelector(`.modal`);
    this.contentModal = this.modal.querySelector(`.modal__content`);
    this.btnCloseModal = this.modal.querySelector('.btnCloseModal');

    newAddress.onclick = (evt) => {
      evt.preventDefault();
      this.handleEventsModal(evt);
    };

    Array.from(el.querySelectorAll('.btnEditar'))?.forEach((btn) => {
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.handleEventsModal(evt);
      });
    });
  }

  async getCEP(element) {
    const { el } = this;
    const { _address } = privateProperties.get(this);
    const cep = element.value.replace(/\D/g, '');
    if (cep && /^[0-9]{8}$/.test(cep)) {
      const response = await getAddressWithCEP(cep);
      if (response) {
        const address = {
          cep,
          street: response.logradouro || '',
          neighborhood: response.bairro || '',
          city: response.localidade || '',
          state: response.uf || '',
        };
        Object.assign(_address, address);
        setPrivateProperties(privateProperties, this, { _address });
        for (const [k, v] of Object.entries(_address)) {
          const input = el.querySelector(`input[name="${k}"]`);
          if (input) input.value = v;
        }
      } else {
        alert.showMessage(1, 'Não foi possível encontrar CEP');
      }
    }
  }

  render() {
    const { _defaultSelector, _addresses } = privateProperties.get(this);

    this.el = this.template(
      'div',
      { class: _defaultSelector },
      template.initialAddresses(_defaultSelector, _addresses)
    );
    if (isMobileDevice()) this.buildBreadcrumb();
    this.getChilds();
    spinner.show(false);
    return this.el;
  }
}
