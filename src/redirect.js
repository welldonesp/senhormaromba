import produtos from './produtos.json' assert { type: 'json' };

// Função para redirecionar para a URL correta de um produto
export async function redirect(produto, loja) {
  // Percorre todas as seções do JSON (Straps, Luvas, Diversos...)
  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = secao[produto]; // agora é um objeto { desc, lojas }
      // Se a loja foi especificada, procura nela, senão usa a primeira URL da lista
      const lojaEscolhida = loja
        ? item.lojas.find(l => l.loja === loja) || item.lojas[0]
        : item.lojas[0];
      return lojaEscolhida.url;
    }
  }
  return null;
}
