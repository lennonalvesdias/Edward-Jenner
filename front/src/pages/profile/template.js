export default {
  profile(_defaultSelector, _user, _pages) {
    const content = `${_defaultSelector}__content`;
    const profile = `${content}__profile`;
    return `
      <div class="container">
        <div class="${content}">
          <div class="${profile}">
            <div class="${profile}__avatar">
              <img src="${_user.avatar}"/>
              <button class="${profile}__avatar__btn">
                <i class="icon-plus-circle-1"></i>
              </button>
            </div>
          </div>
          <div class="${content}__control">
            <div class="${content}__links">
              <ul>
                ${_pages
                  .map(
                    (item) => `
                  <li>
                    <a href="${item.route}">
                      <span>
                        <i class="${item.icon}"></i>
                      </span>
                      ${item.name}
                    </a>
                  </li>
                `
                  )
                  .join('')}                
              </ul>
            </div>  
            <div class="${content}__pages"></div>        
          </div>
        </div>
      </div>
      `;
  },
};
