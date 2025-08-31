// Radical das pastas
const ASSETS_BASE = 'https://welldonesp.github.io/senhormaromba/assets';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

// Função para buscar o JSON de produtos
async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error('Não foi possível carregar os produtos');
  return res.json();
}

// Normaliza nomes para comparação (remove espaços e coloca em minúsculo)
function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

// Função para redirecionar para a URL correta de um produto
export async function redirect(produto, loja) {
  const produtos = await getProdutos();

  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = secao[produto];

      let lojaEscolhida;

      if (loja) {
        // Busca normalizando
        lojaEscolhida = item.lojas.find(l => normalize(l.loja) === normalize(loja));
      }

      // Se não encontrou, pega a primeira loja da lista
      if (!lojaEscolhida) lojaEscolhida = item.lojas[0];

      return lojaEscolhida.url;
    }
  }

  return null;
}
