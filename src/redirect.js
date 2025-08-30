export async function redirect(produto, loja) {
  const res = await fetch('https://raw.githubusercontent.com/welldonesp/senhormaromba/main/produtos.json');
  const produtos = await res.json();

  if (!produtos[produto]) return null;

  const destino = loja && produtos[produto].links[loja]
                  ? produtos[produto].links[loja]
                  : Object.values(produtos[produto].links)[0];

  return destino;
}
