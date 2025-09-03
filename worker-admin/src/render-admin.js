import { redirect, normalizeLoja, redirectReal, getProdutos } from '../../shared/redirect.js';

const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const CSS_BASE = BASE + 'worker-admin/src/';
const PRODUTOS_IMG_BASE = `${ASSETS_BASE}/produtos/`;

function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Função que retorna o emoji do status
function statusEmoji(status) {
  switch (status) {
    case "0": return "❓ Verificar";
    case "1": return "✅ Ok";
    case "2": return "⏸️ Pausado";
    case "3": return "❌ Quebrado";
    default: return "";
  }
}

function htmlToText(str) {
  if (!str) return '';
  // substitui <br> por quebra de linha e remove HTML
  return str.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '');
}

// Função que monta o template do YouTube
function youtubeTemplate(nome, tit, descricao, lojas) {
  const lojasAtivas = lojas.filter(l => l.status === "0" || l.status === "1");
  let text = `*${tit || nome}* - ${htmlToText(descricao)}\n\n`;
  for (const l of lojasAtivas) {
    const lojaHref = redirect(nome, l.loja);
    text += `👉 [${l.loja}] ${lojaHref}\n\n`;
  }
  return text.replace(/\s+$/, '');
}

export async function renderAdminPage() {
  const produtos = await getProdutos();
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Administração - Produtos Senhor Maromba</title>
      <link rel="stylesheet" href="${CSS_BASE}style-admin.css?v=6">
      <meta name="robots" content="noindex, nofollow">
    </head>
    <body>
      <h1>Administração - Produtos Senhor Maromba</h1>

      <script>
        async function copyTemplate(id) {
          const template = document.getElementById(id).textContent.trimEnd();
          try {
            await navigator.clipboard.writeText(template + '\\n');
            alert('Template copiado para o clipboard!');
          } catch (err) {
            alert('Erro ao copiar template: ' + err);
          }
        }

        // mesmo fallback do render.js
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
          img.src = '${PRODUTOS_IMG_BASE}placeholder.png';
        }
      </script>
  `;

  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    html += `<h2>${secaoNome}</h2>`;

    for (const [produtoNome, produtoDados] of Object.entries(secaoProdutos)) {
      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const titulo = produtoDados.tit || nomeFormatado;
      const descricao = produtoDados.desc || '';
      const templateId = `template-${produtoNome}`;

      html += `
        <div class="produto">
          <img class="produto-img"
               src="${PRODUTOS_IMG_BASE}${produtoNome}.webp"
               data-src-webp="${PRODUTOS_IMG_BASE}${produtoNome}.webp"
               data-src-png="${PRODUTOS_IMG_BASE}${produtoNome}.png"
               data-src-jpg="${PRODUTOS_IMG_BASE}${produtoNome}.jpg"
               data-fallback-step="0"
               onerror="fallbackImg(this)"
               alt="${titulo}">
          <div class="produto-info">
            <p><strong>Código:</strong> ${produtoNome}</p>
            <h3>${titulo}</h3>
            <p>${descricao}</p>
            <button onclick="copyTemplate('${templateId}')">Copiar template YouTube</button>
            <pre id="${templateId}" style="display:none;">
${youtubeTemplate(produtoNome, titulo, descricao, produtoDados.lojas)}
            </pre>
            <table>
              <tr>
                <th>Status</th>
                <th>Loja</th>
                <th>Link Original</th>
                <th>Link Redirecionamento</th>
              </tr>
      `;

      for (const l of produtoDados.lojas) {        
        const lojaHref = redirect(produtoNome, l.loja);

        html += `
              <tr>
                <td>${statusEmoji(l.status)}</td>
                <td>${l.loja}</td>
                <td><a href="${l.url}" target="_blank">${l.url}</a></td>
                <td><a href="${lojaHref}" target="_blank">${lojaHref}</a></td>
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
