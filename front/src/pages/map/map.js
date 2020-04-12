/* eslint-disable */
import './map.scss';
import { Button, alert, spinner } from '../../components';
import { Component } from '../../@core';
import { TButton } from '../../models';
import template from './template.js';

const privateProperties = new WeakMap();
/**
 * @class Map
 * @classdesc component/class Map
 */
export default class Map extends Component {
  constructor() {
    super();
    privateProperties.set(this, {
      _defaultSelector: 'c__map',
    });
  }

  render() {
    const { _defaultSelector } = privateProperties.get(this);
    spinner.show(true);
    const btnReadRequest = new Button(new TButton({ label: 'Ver Pedido' }));

    const nearbyMock = {
      client: {
        name: 'Claudio Alves',
        distance: 2,
        image: 'https://imagens.publico.pt/imagens.aspx/1406209?tp=UH&db=IMAGENS&type=JPG',
        description:
          'Eu sou um senhor amável e possuo uma senhora maravilhosa, gostaria de uma alma querida para ir ao mercado para mim, pois estou no grupo de risco.',
        location: {
          latitude: -23.6036901,
          longitude: -46.6620627,
        },
      },
      request: {
        items: ['Item A', 'Item B', 'Item C', 'Item D', 'Item E', 'Item F', 'Item G', 'Item H'],
      },
    };
    const latitude = -23.5306712;
    const longitude = -46.448034299999996;
    // checar se já existe instancia
    const markerclustererplus = document.createElement('script');
    markerclustererplus.src = 'https://unpkg.com/@google/markerclustererplus@4.0.1/dist/markerclustererplus.min.js';
    markerclustererplus.async = true;
    document.querySelector('body').appendChild(markerclustererplus);

    const googleapismaps = document.createElement('script');
    googleapismaps.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyA24yDHFfDuszVUomPTe8EiLTIdGjbESYc';
    googleapismaps.async = true;
    googleapismaps.onload = () => {
      console.log('HER');
      spinner.show(false);
      // locationClient = {lat: nearbyMock.client.location.latitude, lng: nearbyMock.client.location.longitude};
      const locationLennon = { lat: latitude, lng: longitude };
      const locationIbirapuera = { lat: -23.6104878, lng: -46.6688605 };

      const map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: locationLennon,
        disableDefaultUI: true,
      });
      new window.google.maps.Marker({ position: locationLennon, map: map });

      const markers = [locationIbirapuera].map(function (location) {
        const marker = new window.google.maps.Marker({
          position: location,
          label: 'Claudio Alves',
        });
        window.google.maps.event.addListener(marker, 'click', function () {
          document.getElementById('client_details').classList.remove('hidden');
        });
        return marker;
      });
      new window.MarkerClusterer(map, markers);
    };
    googleapismaps.onerror = () => {
      spinner.show(false);
      alert.showMessage(1, 'Erro ao carregar o mapa');
    };
    document.querySelector('body').appendChild(googleapismaps);

    this.el = this.template(
      'div',
      { class: _defaultSelector },
      template.map(_defaultSelector, nearbyMock, btnReadRequest)
    );
    return this.el;
  }
}
