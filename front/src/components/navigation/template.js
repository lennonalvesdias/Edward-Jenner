export default {
  navigation(_defaultSelector, _items) {
    return `
      <div class="container">
        <nav class="${_defaultSelector}__nav">
          <ul>
            <li>
              <a>
                <span class="${_defaultSelector}__nav__icon">
                  <i class="icon-menu-3"></i>
                </span>    
                <span class="${_defaultSelector}__nav__names">Menu</span>            
              </a>
            </li>
            ${_items
              .map((item) => {
                return `
                <li>
                  <a href="${item.route}" data-router-link ${
                  item.default ? 'data-router-default="true"' : 'data-router-default="false"'
                }>
                    <span class="${_defaultSelector}__nav__icon">
                      <i class="${item.icon}"></i>
                    </span>
                    <span class="${_defaultSelector}__nav__names">${item.name}</span>
                  </a>
                </li>
              `;
              })
              .join('')}
          </ul>
        </nav>
      </div>
    `;
  },
};
