export default {
  address(_defaultSelector, _address) {
    return `
        <div class="container">
          <div class="${_defaultSelector}__content">
            <div class="c__input">
              <select 
                class="c__input__field"
                name="type"
                tabindex="1"
                placeholder=" "
                value="${_address.type}">
                <option value="0">Casa</option>
                <option value="1">Trabalho</option>
                <option value="2">Outro</option>
              </select>              
              <label class="c__input__label">Tipo:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="cep"                                 
                tabindex="1" 
                maxlength="9"
                required
                placeholder=" "
                value="${_address.cep}"/>
              <label class="c__input__label">CEP:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="street"                                 
                tabindex="2" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.street}"/>
              <label class="c__input__label">Rua/Avenida:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="number"                                 
                tabindex="3" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.number}"/>
              <label class="c__input__label">Número:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="complement"                                 
                tabindex="5" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.complement}"/>
              <label class="c__input__label">Complemento:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="neighborhood"                                 
                tabindex="6" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.neighborhood}"/>
              <label class="c__input__label">Bairro:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="state"                                 
                tabindex="7" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.state}"/>
              <label class="c__input__label">Estado:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="country"                                 
                tabindex="8" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_address.country}"/>
              <label class="c__input__label">País:</label>
            </div>
            <button class="c__button c__button--reverse btnSendAddress" type="button" disabled tabindex="9">Salvar</button>
          </div>
        </div>
      `;
  },
  initialAddresses(_defaultSelector, _addresses) {
    return `
      <div class="container">
        <div class="${_defaultSelector}__content">     
          ${_addresses
            .map(
              (address) => `
                <div class="${_defaultSelector}__content__card">
                  <span>${address.type}</span>
                  <div class="${_defaultSelector}__content__card__address">
                    ${address.street}, nº ${address.number}
                  </div>
                  <div class="${_defaultSelector}__content__card__bts">
                    <button class="btnEditar" data-identify-item="${address.cep}">Editar</button>
                    <button>Excluir</button>
                  </div>
                </div>
              `
            )
            .join('')}
          <button class="c__button c__button--reverse newAddress" type="button">Novo Endereço</button>
        </div>
        <div class="modal">
          <div class="modal__close">
            <button class="btnCloseModal"><i class="icon-cancel-1"></i></button>
          </div>
          <div class="modal__content"></div>
        </div>
      </div>
    `;
  },
};
