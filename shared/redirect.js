// shared/redirect.js

export const BASE_REDIRECT = 'https://loja.senhormaromba.com.br/';
const ASSETS_BASE = 'https://welldonesp.github.io/senhormaromba/assets';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

// Normaliza nomes (remove espaços e coloca em minúsculo)
function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

// Exporta para uso externo em renderPage e index do worker
export function normalizeLoja(loja) {
  return normalize(loja);
}

// Busca produtos do JSON
export async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error('Não foi possível carregar os produtos');
  return res.json();
}

// Retorna a URL real da loja (para redirecionamento efetivo)
export async function redirectReal(produto, loja) {
  const produtos = await getProdutos();

  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = secao[produto];
      let lojaEscolhida;

      if (loja) {
        lojaEscolhida = item.lojas.find(l => normalize(l.loja) === normalize(loja));
      }

      if (!lojaEscolhida) lojaEscolhida = item.lojas[0];

      return lojaEscolhida.url;
    }
  }

  return null;
}

// Retorna a URL interna de redirecionamento (do worker)
export function redirect(produto, loja) {
  const lojaNorm = normalize(loja);
  return `${BASE_REDIRECT}${produto}/${lojaNorm}`;
}
