const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const CSS_BASE = BASE + 'worker-loja/src/';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error('Não foi possível carregar os produtos');
  return res.json();
}

function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Normaliza o nome da loja para gerar o ícone e o link
function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

function lojaIcon(loja) {
  const nomeArquivo = loja.toLowerCase().replace(/\s+/g, '') + '.png';
  return `${ASSETS_BASE}/lojas/${nomeArquivo}`;
}

export async function renderPage() {
  const produtos = await getProdutos();
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <link rel="stylesheet" href="${CSS_BASE}style.css?v=4">
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
        const lojaHref = `/` + produtoNome + `/` + normalize(l.loja);
        html += `
          <a class="loja-link" href="${lojaHref}">
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
