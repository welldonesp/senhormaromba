import produtos from './produtos.json' assert { type: 'json' };

export async function redirect(produto, loja) {
  for (const secao of Object.values(produtos)) {
    if (secao[produto]) {
      const item = loja
        ? secao[produto].find(p => p.loja === loja) || secao[produto][0]
        : secao[produto][0];
      return item.url;
    }
  }
  return null;
}
