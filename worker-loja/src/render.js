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

function stripHTML(str) {
  return str ? str.replace(/<[^>]*>?/gm, '') : ''; // remove tags com segurança
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
      const descricaoAlt = stripHTML(descricao);

      html += `
      <div class="produto">
        <div class="produto-container">

          <img class="produto-img"
               src="${ASSETS_BASE}/produtos/${produtoNome}.webp"
               data-src-webp="${ASSETS_BASE}/produtos/${produtoNome}.webp"
               data-src-png="${ASSETS_BASE}/produtos/${produtoNome}.png"
               data-src-jpg="${ASSETS_BASE}/produtos/${produtoNome}.jpg"
               data-fallback-step="0"
               alt="${nomeFormatado} - ${descricaoAlt} | Loja Senhor Maromba"
               title="${nomeFormatado} para musculação - Loja Senhor Maromba"
               onclick="openModal(this)"
               onerror="fallbackImg(this)">
          
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

  // Modal global + scripts para fallback de imagens e modal
  html += `
    <div id="imgModal" class="modal" aria-hidden="true">
      <span class="modal-close" onclick="closeModal()" role="button" aria-label="Fechar">&times;</span>
      <img class="modal-content" id="modalImg" alt="">
    </div>

    <footer>
      Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
      Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a>
    </footer>

    <script>
      // fallbackImg: tenta png → jpg → placeholder (começa em webp já carregado no src inicial)
      function fallbackImg(img) {
        // parâmetro img é o elemento <img>
        const step = parseInt(img.dataset.fallbackStep || '0', 10);

        if (step === 0) {
          img.dataset.fallbackStep = '1';
          if (img.dataset.srcPng) { img.src = img.dataset.srcPng; return; }
        }

        if (step <= 1) {
          img.dataset.fallbackStep = '2';
          if (img.dataset.srcJpg) { img.src = img.dataset.srcJpg; return; }
        }

        // último recurso: placeholder
        img.onerror = null; // evita loop
        img.src = '${ASSETS_BASE}/produtos/placeholder.png';
      }

      // openModal aceita um elemento <img> ou uma URL
      function openModal(elOrSrc) {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        let src;
        if (!elOrSrc) return;
        if (typeof elOrSrc === 'string') src = elOrSrc;
        else src = elOrSrc.currentSrc || elOrSrc.src || elOrSrc.getAttribute('src');
        modalImg.src = src;
        modalImg.alt = '';
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
      }

      function closeModal() {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
      }

      // Fecha modal ao clicar fora da imagem
      window.addEventListener('click', function(event) {
        const modal = document.getElementById('imgModal');
        if (event.target === modal) {
          closeModal();
        }
      });

      // Fecha com ESC
      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
      });
    </script>
    </body>
    </html>
  `;

  return html;
}
