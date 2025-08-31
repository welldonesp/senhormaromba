const BASE = 'https://welldonesp.github.io/senhormaromba/';
const ASSETS_BASE = BASE + 'assets';
const PRODUTOS_URL = `${ASSETS_BASE}/produtos/_produtos.json`;

// Função para buscar o JSON de produtos
async function getProdutos() {
  const res = await fetch(PRODUTOS_URL);
  if (!res.ok) throw new Error('Não foi possível carregar os produtos');
  return res.json();
}

// Função para redirecionar para a URL correta de um produto
export async function redirect(produto, loja) {
  const produtos = await getProdutos();

  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = secao[produto];
      const lojaEscolhida = loja
        ? item.lojas.find(l => l.loja === loja) || item.lojas[0]
        : item.lojas[0];
      return lojaEscolhida.url;
    }
  }
  return null;
}
