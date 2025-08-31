import produtos from './produtos.json' assert { type: 'json' };

// Função para colocar as iniciais de cada palavra em maiúscula
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Radical das pastas para facilitar manutenção
const ASSETS_BASE = 'https://welldonesp.github.io/senhormaromba/assets';

// Função para gerar URL do ícone da loja
function lojaIcon(loja) {
  const nomeArquivo = loja.toLowerCase().replace(/\s+/g, '') + '.png';
  return `${ASSETS_BASE}/lojas/${nomeArquivo}`;
}

export async function renderPage() {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <link rel="stylesheet" href="${ASSETS_BASE}/../src/style.css?v=4">
    </head>
    <body>
      <div class="header">
        <img src="${ASSETS_BASE}/logotipo.png" alt="Logotipo Senhor Maromba" class="logo">
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
          <img class="produto-img" src="${ASSETS_BASE}/produtos/${produtoNome}.webp" 
               onerror="this.onerror=null;this.src='${ASSETS_BASE}/produtos/placeholder.png';" 
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
