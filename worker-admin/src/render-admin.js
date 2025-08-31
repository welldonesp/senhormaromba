const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const CSS_BASE = BASE + 'worker-admin/src/';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;
const PRODUTOS_IMG_BASE = `${ASSETS_BASE}/produtos/`;

//import { redirect } from './redirect.js';
import { redirect } from '../../shared/redirect.js';


// Função para colocar as iniciais de cada palavra em maiúscula
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error('Não foi possível carregar os produtos');
  return res.json();
}

export async function renderAdminPage() {
  const produtos = await getProdutos();
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Administração - Produtos Senhor Maromba</title>
      <link rel="stylesheet" href="${CSS_BASE}style-admin.css?v=4">
      <meta name="robots" content="noindex, nofollow">
    </head>
    <body>
      <h1>Administração - Produtos Senhor Maromba</h1>
  `;

  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    html += `<h2>${secaoNome}</h2>`;

    for (const [produtoNome, produtoDados] of Object.entries(secaoProdutos)) {
      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const descricao = produtoDados.desc || '';

      html += `
        <div class="produto">
          <img class="produto-img" src="${PRODUTOS_IMG_BASE}${produtoNome}.webp"
               onerror="this.onerror=null;this.src='${PRODUTOS_IMG_BASE}placeholder.png';"
               alt="${nomeFormatado}">
          <div class="produto-info">
            <h3>${nomeFormatado}</h3>
            <p>${descricao}</p>
            <table>
              <tr>
                <th>Loja</th>
                <th>Link Original</th>
                <th>Link Redirecionamento</th>
              </tr>
      `;

      for (const l of produtoDados.lojas) {
        const urlRedir = redirect(produtoNome, l.loja);

        html += `
              <tr>
                <td>${l.loja}</td>
                <td><a href="${l.url}" target="_blank">${l.url}</a></td>
                <td><a href="${urlRedir}" target="_blank">${urlRedir}</a></td>
              </tr>
        `;
      }

      html += `</table></div></div>`;
    }
  }

  html += `
    </body>
    </html>
  `;

  return html;
}
