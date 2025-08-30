import produtos from './produtos.json' assert { type: 'json' };

export function handleRedirect(produto, loja) {
  if (!produtos[produto]) {
    return new Response("Produto não encontrado", { status: 404 });
  }

  const destino = loja
    ? produtos[produto].find(p => p.loja === loja)?.url || produtos[produto][0].url
    : produtos[produto][0].url;

  return new Response(null, {
    status: 301,
    headers: {
      "Location": destino,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
    }
  });
}
