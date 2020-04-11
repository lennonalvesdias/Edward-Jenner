export default {
  phones(_defaultSelector, _phone) {
    return `
        <div class="container">
          <div class="${_defaultSelector}__content">
            <div class="c__input">
              <select 
                class="c__input__field"
                name="type"
                tabindex="1"
                placeholder=" "
                value="${_phone.type}">
                <option value="0">Casa</option>
                <option value="1">Celular</option>                
              </select>              
              <label class="c__input__label">Tipo:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="ddd"           
                tabindex="1" 
                maxlength="2"
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_phone.ddd}"/>
              <label class="c__input__label">DDD:</label>
            </div>
            <div class="c__input">
              <input 
                class="c__input__field" 
                type="text" 
                name="number"                                 
                tabindex="2" 
                required
                placeholder=" "
                pattern=".*\\S.*"
                value="${_phone.number}"/>
              <label class="c__input__label">Número:</label>
            </div>
            <button class="c__button c__button--reverse btnSend" type="button" disabled tabindex="9">Salvar</button>
          </div>
        </div>
      `;
  },
  initialPhones(_defaultSelector, _phones) {
    return `
      <div class="container">
        <div class="${_defaultSelector}__content">
        ${_phones
          .map(
            (phone) => `
              <div class="${_defaultSelector}__content__card">
                <span>${phone.type}</span>
                <div class="${_defaultSelector}__content__card__phones">
                  (${phone.ddd}) ${phone.number}
                </div>
                <div class="${_defaultSelector}__content__card__bts">
                  <button class="btnEditar" data-identify-item="${phone.number}">Editar</button>
                  <button>Excluir</button>
                </div>
              </div>
            `
          )
          .join('')}
          <button class="c__button c__button--reverse newPhone" type="button">Novo Telefone</button>
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
