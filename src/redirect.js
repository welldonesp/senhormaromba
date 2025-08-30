import produtos from './produtos.json' assert { type: 'json' };

export async function redirect(produto, loja) {
  if (!produtos[produto]) return null;
  return loja
    ? produtos[produto].find(p => p.loja === loja)?.url || produtos[produto][0].url
    : produtos[produto][0].url;
}

