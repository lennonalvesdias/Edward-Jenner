export default {
  phones(_defaultSelector, _user) {
    console.log(_user); //eslint-disable-line
    return `
        <div class="container">
          <div class="${_defaultSelector}__content">
            Telefones
          </div>
        </div>
      `;
  },
};
