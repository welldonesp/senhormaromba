var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../shared/redirect.js
var BASE_REDIRECT = "https://loja.senhormaromba.com.br/";
var ASSETS_BASE = "https://welldonesp.github.io/senhormaromba/assets";
var PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;
function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, "");
}
__name(normalize, "normalize");
function normalizeLoja(loja) {
  return normalize(loja);
}
__name(normalizeLoja, "normalizeLoja");
async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error("N\xE3o foi poss\xEDvel carregar os produtos");
  return res.json();
}
__name(getProdutos, "getProdutos");
async function redirectReal(produto, loja) {
  const produtos = await getProdutos();
  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = secao[produto];
      let lojaEscolhida;
      if (loja) {
        lojaEscolhida = item.lojas.find((l) => normalize(l.loja) === normalize(loja));
      }
      if (!lojaEscolhida) lojaEscolhida = item.lojas[0];
      return lojaEscolhida.url;
    }
  }
  return null;
}
__name(redirectReal, "redirectReal");
function redirect(produto, loja) {
  const lojaNorm = normalize(loja);
  return `${BASE_REDIRECT}${produto}/${lojaNorm}`;
}
__name(redirect, "redirect");

// src/render.js
var BASE = "https://welldonesp.github.io/senhormaromba/";
var ASSETS_BASE2 = BASE + "assets";
var CSS_BASE = BASE + "worker-loja/src/";
var PRODUTOS_URL2 = `${ASSETS_BASE2}/produtos/_produtos.json`;
function capitalizeWords(str) {
  return str.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
__name(capitalizeWords, "capitalizeWords");
function lojaIcon(loja) {
  return `${ASSETS_BASE2}/lojas/${normalizeLoja(loja)}.png`;
}
__name(lojaIcon, "lojaIcon");
function stripHTML(str) {
  return str ? str.replace(/<[^>]*>?/gm, "") : "";
}
__name(stripHTML, "stripHTML");
async function renderPage() {
  const produtos = await getProdutos();
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload">
      <meta name="description" content="Pare de gastar com produtos ruins! Loja Senhor Maromba tem tudo para muscula\xE7\xE3o testado de verdade. Compre agora!">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loja Senhor Maromba</title>

      <!-- FAVICONS -->
      <link rel="icon" href="/favicon.ico" sizes="any">
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
      <link rel="stylesheet" href="${CSS_BASE}style.css?v=16">

      <!-- Google tag (gtag.js) -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-20QTN1YSP8"><\/script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-20QTN1YSP8');
      <\/script>      

      </head>
    <body>
      <div class="header">
        <img src="${ASSETS_BASE2}/logotipo.png" alt="Logotipo Senhor Maromba" class="logo">
        <h1>Loja Senhor Maromba \u{1F525}</h1>
      </div>
      Produtos para quem treina s\xE9rio. \u{1F4AA}
  `;
  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    const produtosAtivos = Object.values(secaoProdutos).filter(
      (produtoDados) => produtoDados.lojas.some((l) => l.status === "0" || l.status === "1")
    );
    if (produtosAtivos.length === 0) continue;
    html += `<h2 class="secao">${secaoNome}</h2>`;
    for (const [produtoNome, produtoDados] of Object.entries(secaoProdutos)) {
      const lojasAtivas = produtoDados.lojas.filter((l) => l.status === "0" || l.status === "1");
      if (lojasAtivas.length === 0) continue;
      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const titulo = produtoDados.tit || nomeFormatado;
      const descricao = produtoDados.desc || "";
      const descricaoAlt = stripHTML(descricao);
      html += `
        <div class="produto">
          <div class="produto-container">
            <div class="produto-info">
              <div class="produto-header">
                <h3>${titulo}</h3>
              </div>

              <div class="produto-body">
                <img class="produto-img"
                    src="${ASSETS_BASE2}/produtos/${produtoNome}.webp"
                    data-src-webp="${ASSETS_BASE2}/produtos/${produtoNome}.webp"
                    data-src-png="${ASSETS_BASE2}/produtos/${produtoNome}.png"
                    data-src-jpg="${ASSETS_BASE2}/produtos/${produtoNome}.jpg"
                    data-fallback-step="0"
                    alt="${titulo} - ${descricaoAlt} | Loja Senhor Maromba"
                    title="${titulo} para muscula\xE7\xE3o - Loja Senhor Maromba"
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
      html += `</div></div></div></div>`;
    }
  }
  html += `
    <div id="imgModal" class="modal" aria-hidden="true">
      <span class="modal-close" onclick="closeModal()" role="button" aria-label="Fechar">&times;</span>
      <img class="modal-content" id="modalImg" alt="">
    </div>

    <footer>
      Conhe\xE7a o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a><br>
      <br>
      Todos os links s\xE3o afiliados.<br>
      Sua compra apoia meu conte\xFAdo! \u{1F64C}<br>
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
        img.src = '${ASSETS_BASE2}/produtos/placeholder.png';
      }

      function openModal(elOrSrc) {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        let src;
        if (!elOrSrc) return;
        if (typeof elOrSrc === 'string') {
          src = elOrSrc;
        } else {
          src = elOrSrc.currentSrc || elOrSrc.src;
        }
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
    <\/script>
    </body>
    </html>
  `;
  return html;
}
__name(renderPage, "renderPage");

// src/index.js
var _BASE = "https://welldonesp.github.io/senhormaromba";
var LOJA_URL = "https://loja.senhormaromba.com.br/";
var index_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter((p) => p);
    const produto = parts[0];
    const loja = parts[1];
    if (url.pathname === "/sitemap.xml") {
      try {
        const sitemapRes = await fetch(`${_BASE}/sitemap.xml`);
        if (!sitemapRes.ok) {
          return new Response("Erro ao carregar sitemap", { status: 500 });
        }
        const sitemap = await sitemapRes.text();
        return new Response(sitemap, {
          headers: { "Content-Type": "application/xml; charset=UTF-8" }
        });
      } catch (err) {
        return new Response("Erro interno ao servir sitemap", { status: 500 });
      }
    }
    if (url.pathname === "/robots.txt") {
      return Response.redirect(`${_BASE}/robots.txt`, 301);
    }
    const aliases = {
      "/favicon.ico": "/assets/favicon.ico",
      "/favicon-16x16.png": "/assets/favicon-16x16.png",
      "/favicon-32x32.png": "/assets/favicon-32x32.png",
      "/apple-touch-icon.png": "/assets/apple-touch-icon.png",
      "/android-chrome-192x192.png": "/assets/android-chrome-192x192.png",
      "/android-chrome-512x512.png": "/assets/android-chrome-512x512.png",
      "/logotipo.png": "/assets/logotipo.png"
    };
    if (aliases[url.pathname]) {
      const assetRes = await fetch(`${_BASE}${aliases[url.pathname]}`);
      if (!assetRes.ok) {
        return new Response("Erro ao carregar asset", { status: 404 });
      }
      let contentType = "application/octet-stream";
      if (url.pathname.endsWith(".png")) contentType = "image/png";
      if (url.pathname.endsWith(".ico")) contentType = "image/x-icon";
      return new Response(await assetRes.arrayBuffer(), {
        headers: { "Content-Type": contentType }
      });
    }
    if (!produto) {
      const html = await renderPage();
      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
        }
      });
    }
    const destino = await redirectReal(produto, loja);
    if (!destino) {
      return new Response(null, {
        status: 301,
        headers: {
          "Location": LOJA_URL,
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
        }
      });
    }
    return new Response(null, {
      status: 301,
      headers: {
        "Location": destino,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
