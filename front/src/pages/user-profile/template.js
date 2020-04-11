export default {
  userProfile(_defaultSelector, _user) {
    return `
      <div class="container">
        <div class="c__input">
          <input 
            class="c__input__field" 
            type="text" 
            name="name" 
            required 
            pattern=".*\\S.*" 
            tabindex="1" 
            placeholder=" "
            value="${_user.name}"/>
          <label class="c__input__label">Nome:</label>
        </div>
        <div class="c__input">
          <input 
            class="c__input__field" 
            type="text" 
            name="username" 
            required 
            pattern=".*\\S.*" 
            tabindex="2" 
            placeholder=" "
            value="${_user.username}"/>
          <label class="c__input__label">Usuário:</label>
        </div>
        <div class="c__input">
          <input 
            class="c__input__field" 
            type="email" 
            name="email" 
            required 
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$" 
            tabindex="3" 
            placeholder=" "
            value="${_user.email}"/>
          <label class="c__input__label">E-mail:</label>
        </div> 
        <div class="c__input">
          <input 
            class="c__input__field" 
            type="text" 
            name="birthday" 
            required 
            pattern=".*\\S.*" 
            tabindex="4" 
            placeholder=" "
            value="${_user.birthday}"/>
          <label class="c__input__label">Data de nascimento:</label>
        </div>
        <div class="c__input">
          <textarea 
            class="c__input__field" 
            name="description"             
            tabindex="5"></textarea>
          <label class="c__input__label">Biografia:</label>
        </div>
        <button class="c__button c__button--reverse" type="button" disabled tabindex="6">Salvar</button>
      </div>
      `;
  },
};
