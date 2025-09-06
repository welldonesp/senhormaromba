const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const CSS_BASE = BASE + 'worker-loja/src/';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

const PAGE_TITLE = 'Loja Senhor Maromba';
const PAGE_SLOGAN = 'Produtos para quem treina sério. 💪';
const PAGE_URL = 'https://loja.senhormaromba.com.br/';
const DATE_UPDATED = '2025-09-06';

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
  return str ? str.replace(/<[^>]*>?/gm, '') : '';
}

function formatDatePTBR(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Função para encontrar produto em qualquer seção
function findProdutoByKey(produtos, key) {
  for (const secao of Object.values(produtos)) {
    if (secao[key]) return secao[key];
  }
  return null;
}

export async function renderPage() {
  const produtos = await getProdutos();
  const produtosSchema = [];

  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload">
      <meta name="description" content="Pare de gastar com produtos ruins! Loja Senhor Maromba tem tudo para musculação testado de verdade. Compre agora!">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${PAGE_TITLE}</title>

      <!-- FAVICONS -->
      <link rel="icon" href="/favicon.ico" sizes="any">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
      <link rel="stylesheet" href="${CSS_BASE}style.css?v=${DATE_UPDATED}3">

      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-20QTN1YSP8"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-20QTN1YSP8');
      </script>

      <!-- JSON-LD WebPage -->
      <script type="application/ld+json">
        ${JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": PAGE_TITLE,
          "url": PAGE_URL,
          "description": PAGE_SLOGAN,
          "dateModified": DATE_UPDATED,
          "mainEntity": produtosSchema
        }, null, 2)}
      </script>
    </head>
    <body>
      <div class="header">
        <img src="${ASSETS_BASE}/logotipo.png" alt="Logotipo ${PAGE_TITLE}" class="logo">
        <h1>${PAGE_TITLE} 🔥</h1>
      </div>
      ${PAGE_SLOGAN}
      <p class="data-atualizacao">Última atualização: ${formatDatePTBR(DATE_UPDATED)}</p>
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
      const titulo = produtoDados.tit || nomeFormatado;
      const descricao = produtoDados.desc || '';
      const descricaoAlt = stripHTML(descricao);

      html += `
        <div class="produto" id="${produtoNome}">
          <div class="produto-container">
            <div class="produto-info">
              <div class="produto-header">
                <h3>${titulo}</h3>
              </div>

              <div class="produto-body">
                <img class="produto-img"
                    src="${ASSETS_BASE}/produtos/${produtoNome}.webp"
                    data-src-webp="${ASSETS_BASE}/produtos/${produtoNome}.webp"
                    data-src-png="${ASSETS_BASE}/produtos/${produtoNome}.png"
                    data-src-jpg="${ASSETS_BASE}/produtos/${produtoNome}.jpg"
                    data-fallback-step="0"
                    alt="${titulo} - ${descricaoAlt} | Loja Senhor Maromba"
                    title="${titulo} para musculação - Loja Senhor Maromba"
                    onclick="openModal(this)"
                    onerror="fallbackImg(this)">

                <p class="produto-desc">${descricao}</p>
              </div>

              <div class="links">
      `;

      for (const l of lojasAtivas) {
        const lojaHref = redirect(produtoNome, l.loja);

        html += `
          <a class="loja-link" 
            href="${lojaHref}" 
            target="_blank"
            onclick="gtag('event', 'click', {
                event_category: 'loja',
                event_label: '${l.loja}',
                value: 1
            });">
            <img src="${lojaIcon(l.loja)}" alt="${titulo} em ${l.loja}">${l.loja}
          </a>
        `;
      }

      html += `</div>`;

      // Produtos relacionados
      if (produtoDados.relacionados && produtoDados.relacionados.length > 0) {
        html += '<div class="produto-relacionados">';
        html += '<span class="relacionados-titulo">👇 Veja também:</span>';

        html += '<ul class="relacionados-list">';
        html += produtoDados.relacionados.map(r => {
          const rProduto = findProdutoByKey(produtos, r);
          const rTitulo = rProduto?.tit || capitalizeWords(r.replace(/-/g, " "));
          return `
            <li>
              <a class="relacionado-link" 
                href="#${r}" 
                onclick="document.getElementById('${r}').scrollIntoView({behavior:'smooth'})">• ${rTitulo}
              </a>
            </li>
          `;
        }).join(' ');
        html += '</ul>';
        html += '</div>';
      }

      // JSON-LD Schema.org com todas as lojas ativas
      const schemaProduto = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": titulo,
        "image": [`${ASSETS_BASE}/produtos/${produtoNome}.webp`],
        "description": descricaoAlt,
        "category": secaoNome,
        "itemCondition": "https://schema.org/NewCondition",
        "offers": lojasAtivas.map(l => ({
          "@type": "Offer",
          "url": redirect(produtoNome, l.loja),
          "priceCurrency": "BRL",
          "availability": "https://schema.org/InStock"
        })),
        "brand": {
          "@type": "Brand",
          "name": "Senhor Maromba"
        }
      };

      // Adiciona no array de schemas da página
      produtosSchema.push(schemaProduto);

      html += `
        <script type="application/ld+json">
          ${JSON.stringify(schemaProduto, null, 2)}
        </script>
      `;

      html += `</div></div></div>`;
    }
  }

  html += `
    <div id="imgModal" class="modal" aria-hidden="true">
      <span class="modal-close" onclick="closeModal()" role="button" aria-label="Fechar">&times;</span>
      <img class="modal-content" id="modalImg" alt="">
    </div>

    <footer>
      Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a><br>
      <br>
      Todos os links são afiliados.<br>
      Sua compra apoia meu conteúdo! 🙌<br>
      <small>Última atualização: ${DATE_UPDATED}</small>
    </footer>

    <script>
      function fallbackImg(img) {
        const step = parseInt(img.dataset.fallbackStep || '0', 10);
        if (step === 0 && img.dataset.srcPng) {
          img.dataset.fallbackStep = '1';
          img.src = img.dataset.srcPng;
          return;
        }
        if (step === 1 && img.dataset.srcJpg) {
          img.dataset.fallbackStep = '2';
          img.src = img.dataset.srcJpg;
          return;
        }
        img.onerror = null;
        img.src = '${ASSETS_BASE}/produtos/placeholder.png';
      }

      function openModal(elOrSrc) {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        let src;
        if (!elOrSrc) return;
        src = typeof elOrSrc === 'string' ? elOrSrc : elOrSrc.currentSrc || elOrSrc.src;
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

      window.addEventListener('click', function(event) {
        const modal = document.getElementById('imgModal');
        if (event.target === modal) closeModal();
      });

      window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
      });
    </script>
    </body>
    </html>
  `;

  return html;
}
