export default {
  list(_defaultSelector, mockItems) {
    return `
				<section class="${_defaultSelector}__list">
				${mockItems
          .map(
            ({ nome, quantidade, precoMaximo }) => `
							<div class="${_defaultSelector}__list__item">
								<i class="icon-user-circle"></i>
								<dl>
									<dt>
										<h3>${nome}</h3>
									</dt>
									<dd>
										<p>Quantidade: ${quantidade}</p>
										<p>Preço maximo: ${precoMaximo}</p>
									</dd>
								</dl>
							</div>
						`
          )
          .join('')}
					
				</section>
      `;
  },
};
