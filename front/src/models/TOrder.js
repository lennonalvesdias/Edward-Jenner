export default class TOrder {
  constructor(order = {}) {
    this.id = order.id || '';
    this.items = order.items || [];
    this.orderType = order.orderType || '';
    this.lastStatus = order.lastStatus || 0;
    this.longitude = order.longitude || '';
    this.latitude = order.latitude || '';
    this.updateIn = order.updateIn || '';
  }
}
