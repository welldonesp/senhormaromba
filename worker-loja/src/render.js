const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const CSS_BASE = BASE + 'worker-loja/src/';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

import { redirect, normalizeLoja, getProdutos } from '../../shared/redirect.js';

function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function lojaIcon(loja) {
  return `${ASSETS_BASE}/lojas/${normalizeLoja(loja)}.png`;
}

export async function renderPage() {
  const produtos = await getProdutos();

  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <meta name="description" content="Pare de gastar com produtos ruins! Loja Senhor Maromba tem tudo para musculação testado de verdade. Compre agora!">
      <link rel="icon" href="${ASSETS_BASE}/favicon.ico" type="image/x-icon">
      <link rel="stylesheet" href="${CSS_BASE}style.css?v=6">
    </head>
    <body>
      <div class="header">
        <img src="${ASSETS_BASE}/logotipo.png" alt="Logotipo Senhor Maromba" class="logo">
        <h1>Loja Senhor Maromba 🔥</h1>
      </div>
      <p>Produtos recomendados e testados nos treinos 💪</p>
  `;

  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    const produtosAtivos = Object.values(secaoProdutos).filter(produtoDados =>
      produtoDados.lojas.some(l => l.status === "0" || l.status === "1")
    );
    if (produtosAtivos.length === 0) continue;

    html += `<h2 class="secao">${secaoNome}</h2>`;

    for (const [produtoNome, produtoDados] of Object.entries(secaoProdutos)) {
      const lojasAtivas = produtoDados.lojas.filter(l => l.status === "0" || l.status === "1");
      if (lojasAtivas.length === 0) continue;

      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const descricao = produtoDados.desc || '';

      html += `
      <div class="produto">
        <div class="produto-container">
          <img class="produto-img" 
              src="${ASSETS_BASE}/produtos/${produtoNome}.webp"
              onerror="this.onerror=null;this.src='${ASSETS_BASE}/produtos/placeholder.png';"
              alt="${nomeFormatado} - ${descricao} | Loja Senhor Maromba"
              title="${nomeFormatado} para musculação - Loja Senhor Maromba"
              onclick="openModal(this.src)">
          <div class="produto-info">

            <div class="produto-header">
              <h3>${nomeFormatado}</h3>
              <p class="produto-desc">${descricao}</p>
            </div>
            <div class="links">
      `;

      for (const l of lojasAtivas) {
        const lojaHref = redirect(produtoNome, l.loja);

        html += `
          <a class="loja-link" href="${lojaHref}" target="_blank">
            <img src="${lojaIcon(l.loja)}" alt="${l.loja}">${l.loja}
          </a>
        `;
      }

      html += `</div></div></div></div>`;
    }
  }

  // Modal global
  html += `
    <div id="imgModal" class="modal">
      <span class="modal-close" onclick="closeModal()">&times;</span>
      <img class="modal-content" id="modalImg">
    </div>

    <footer>
      Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
      Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a>
    </footer>

    <script>
      function openModal(src) {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        modal.style.display = 'block';
        modalImg.src = src;
      }
      function closeModal() {
        document.getElementById('imgModal').style.display = 'none';
      }
      // Fecha modal ao clicar fora da imagem
      window.onclick = function(event) {
        const modal = document.getElementById('imgModal');
        if (event.target === modal) {
          closeModal();
        }
      }
    </script>
    </body>
    </html>
  `;

  return html;
}
