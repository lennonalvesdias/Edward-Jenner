export default {
  login(_defaultSelector) {
    return `
      <div class="container">
        <div class="${_defaultSelector}__content">
          <div class="${_defaultSelector}__content__logotipo"></div>
          <div class="c__input">
            <input class="c__input__field" type="text" name="username" placeholder=" " required pattern=".*\\S.*" tabindex="1"/>
            <label class="c__input__label">Usuário:</label>
          </div>
          <div class="c__input">
            <input class="c__input__field" type="password" name="password" placeholder=" " minlength="6" required pattern=".*\\S.*" tabindex="2"/>
            <label class="c__input__label">Senha:</label>
          </div>
          <div class="c__checkbox">
            <div class="c__checkbox__content">
              <input 
                class="c__checkbox__field" 
                type="checkbox" 
                name="keepConnected" 
                value="true" 
                id="keepConnected" 
                tabindex="3"/>
              <label for="keepConnected" class="c__checkbox__content__checkmark"></label>
            </div>
            <label for="keepConnected">Manter conectado</label>
          </div>
          <button class="c__button c__button--reverse" type="button" disabled tabindex="7">Entrar</button>
        </div>
      </div>
    `;
  },
};
