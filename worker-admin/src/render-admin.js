import produtos from '../assets/produtos/_produtos.json' assert { type: 'json' };
import { redirect } from './redirect.js';

// Função para colocar as iniciais de cada palavra em maiúscula
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Pasta base para imagens de produtos
const PRODUTOS_BASE = 'https://welldonesp.github.io/senhormaromba/assets/produtos/';

export async function renderAdminPage() {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Administração - Produtos Senhor Maromba</title>
      <link rel="stylesheet" href="https://welldonesp.github.io/senhormaromba/src/style-admin.css">
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
          <img class="produto-img" src="${PRODUTOS_BASE}${produtoNome}.webp"
               onerror="this.onerror=null;this.src='${PRODUTOS_BASE}placeholder.png';"
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
        const urlRedir = await redirect(produtoNome, l.loja);
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
