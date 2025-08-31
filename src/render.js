import produtos from './produtos.json' assert { type: 'json' };

// Função para colocar as iniciais de cada palavra em maiúscula
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Mapeia o nome da loja para o ícone correspondente
function lojaIcon(loja) {
  const icons = {
    amazon: 'https://welldonesp.github.io/senhormaromba/assets/lojas/amazon.png',
    mercadolivre: 'https://welldonesp.github.io/senhormaromba/assets/lojas/mercadolivre.png',
    aliexpress: 'https://welldonesp.github.io/senhormaromba/assets/lojas/aliexpress.png'
  };
  return icons[loja.toLowerCase()] || 'https://welldonesp.github.io/senhormaromba/assets/lojas/placeholder.png';
}

export async function renderPage() {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <link rel="stylesheet" href="https://welldonesp.github.io/senhormaromba/src/style.css?v=4">
    </head>
    <body>
      <div class="header">
        <img src="https://welldonesp.github.io/senhormaromba/assets/logotipo.png" alt="Logotipo Senhor Maromba" class="logo">
        <h1>Loja Senhor Maromba 🔥</h1>
      </div>
      <p>Produtos recomendados e testados nos treinos 💪</p>
  `;

  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    html += `<h2 class="secao">${secaoNome}</h2>`;

    for (const [produtoNome, produtoDados] of Object.entries(secaoProdutos)) {
      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const descricao = produtoDados.desc || '';

      html += `
      <div class="produto">
        <div class="produto-container">
          <img class="produto-img" src="https://welldonesp.github.io/senhormaromba/assets/produtos/${produtoNome}.webp" 
               onerror="this.onerror=null;this.src='https://welldonesp.github.io/senhormaromba/assets/produtos/placeholder.png';" 
               alt="${nomeFormatado}">
          <div class="produto-info">
            <h3>${nomeFormatado}: ${descricao}</h3>
            <div class="links">
      `;

      for (const l of produtoDados.lojas) {
        html += `
          <a class="loja-link" href="/${produtoNome}/${l.loja}">
            <img src="${lojaIcon(l.loja)}" alt="${l.loja}">${l.loja}
          </a>
        `;
      }

      html += `</div></div></div></div>`;
    }
  }

  html += `
    <footer>
      Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
      Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a>
    </footer>
    </body>
    </html>
  `;

  return html;
}
