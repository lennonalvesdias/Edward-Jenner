export default class TUser {
  constructor(user = {}) {
    this.id = user.id || '';
    this.name = user.name || '';
    this.username = user.username || '';
    this.email = user.email || '';
    this.password = user.password || '';
    this.avatar = user.avatar || '';
    this.addresses = user.adresses || [];
    this.phones = user.phones || [];
    //this.applicationUserId = user.applicationUserId || '';
    this.type = user.type || 0;
    this.birthday = user.birthday || '';
    this.distance = user.distance || '';
    this.logged = user.logged || false;
    this.keepConnected = false;
    this.description = user.description || '';
  }

  get type() {
    return typeUser(this._type);
  }

  set type(type) {
    this._type = type;
    return;
  }
}

const typeUser = (type) => {
  const types = {
    0: 'Cliente',
    1: 'Ajudante',
    2: 'Vendedor',
  };

  return types[type];
};
