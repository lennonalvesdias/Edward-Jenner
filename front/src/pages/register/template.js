export default {
  register(_defaultSelector) {
    return `
      <div class="container">
        <div class="${_defaultSelector}__content">
          <form id="formRegister">
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="name" 
                required 
                placeholder=" " 
                pattern=".*\\S.*" 
                tabindex="1"/>
              <label class="c__input__label">Nome completo:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="email" 
                required 
                placeholder=" " 
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" 
                tabindex="2"/>
              <label class="c__input__label">E-mail:</label>
              <div class="requirements">Informe um e-mail válido.</div>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="username" 
                required 
                placeholder=" " 
                pattern=".*\\S.*" 
                tabindex="3"/>
              <label class="c__input__label">Usuário:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="birthday" 
                required 
                placeholder=" " 
                pattern="[0-9]{2}\\/[0-9]{2}\\/[0-9]{4}$" 
                tabindex="4"/>
              <label class="c__input__label">Data de nascimento:</label>
              <div class="requirements">A data deve ter o formato: dd/mm/aaaa. Ex.: 20/02/2020</div>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="password" 
                name="password" 
                required 
                placeholder=" " 
                minlength="6" 
                pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" 
                tabindex="5"/>
              <label class="c__input__label">Senha:</label>
              <div class="requirements">A sua senha deve conter no mínimo 6 caracteres.</div>
            </div>
            <div class="${_defaultSelector}__content__radios">
              <div class="c__radio">
                <div class="c__radio__content">
                  <input class="c__radio__field" type="radio" name="typeUser" value="0" id="typeUser0" tabindex="6"/>
                  <label for="typeUser0" class="c__radio__content__checkmark"></label>
                </div>
                <label for="typeUser0">Preciso de ajuda</label>
              </div>
              <div class="c__radio">
                <div class="c__radio__content">
                  <input class="c__radio__field" type="radio" name="typeUser" value="1" id="typeUser1" tabindex="5"/>
                  <label for="typeUser1" class="c__radio__content__checkmark"></label>
                </div>
                <label for="typeUser1">Quero ajudar</label>
              </div>
              <div class="c__radio">
                <div class="c__radio__content">
                  <input class="c__radio__field" type="radio" name="typeUser" value="2" id="typeUser2" tabindex="6"/>
                  <label for="typeUser2" class="c__radio__content__checkmark"></label>
                </div>
                <label for="typeUser2">Empresa</label>
              </div>
            </div>
            <button class="c__button c__button--reverse btnSend" type="button" disabled tabindex="7">Cadastrar</button>
          </form>
        </div>
        <div class="${_defaultSelector}__terms">
          <h4>Termos de uso.</h4>
          <div class="${_defaultSelector}__terms__content">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, 
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
              commodo consequat. Duis aute irure dolor in reprehenderit in 
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <span>Ao clicar em cadastrar você está aceitando as condições dispostas no termos de uso.</span>
          <button class="c__button c__button--reverse btnSend" type="button" disabled tabindex="7">Cadastrar</button>
        </div>
      </div>
      `;
  },
};
