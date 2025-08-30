import produtos from './produtos.json' assert { type: 'json' };

// Função para redirecionar para a URL correta de um produto
export async function redirect(produto, loja) {
  // Percorre todas as seções do JSON (Straps, Luvas, Diversos...)
  for (const secao of Object.values(produtos)) {
    // Verifica se o produto existe nesta seção
    if (secao[produto]) {
      // Se a loja foi especificada, procura nela, senão usa a primeira URL da lista
      const item = loja
        ? secao[produto].find(p => p.loja === loja) || secao[produto][0]
        : secao[produto][0];
      // Retorna a URL encontrada
      return item.url;
    }
  }
  // Retorna null se o produto não existir em nenhuma seção
  return null;
}
