import produtos from './produtos.json' assert { type: 'json' };

// Função para colocar as iniciais de cada palavra em maiúscula
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function renderPage() {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <link rel="stylesheet" href="https://welldonesp.github.io/senhormaromba/src/style.css?v=2">
    </head>
    <body>
      <div class="header">
        <img src="https://welldonesp.github.io/senhormaromba/assets/logotipo.png" alt="Logotipo Senhor Maromba" class="logo">
        <h1>Loja Senhor Maromba 🔥</h1>
      </div>
      <p>Produtos recomendados e testados nos treinos 💪</p>
  `;

  // Percorre cada seção do JSON
  for (const [secaoNome, secaoProdutos] of Object.entries(produtos)) {
    html += `<h2 class="secao">${secaoNome}</h2>`; // Título da seção

    // Percorre cada produto dentro da seção
    for (const [produtoNome, lojas] of Object.entries(secaoProdutos)) {
      const nomeFormatado = capitalizeWords(produtoNome.replace(/-/g, " "));
      const descricao = lojas[0]?.desc || '';

      html += `<div class="produto"><h3>${nomeFormatado}: ${descricao}</h3>`;
      html += `<div class="links">`;

      // Links de cada loja
      for (const l of lojas) {
        html += `<a href="/${produtoNome}/${l.loja}">${l.loja}</a>`;
      }

      html += `</div></div>`;
    }
  }

  html += `<footer>Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
           Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a></footer>`;
  html += `</body></html>`;

  return html;
}
