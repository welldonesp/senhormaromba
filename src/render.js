import produtos from './produtos.json' assert { type: 'json' };

function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function renderPage() {
  const cssUrl = 'https://raw.githubusercontent.com/seuusuario/senhormaromba-worker/main/src/style.css';

  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <link rel="stylesheet" href="${cssUrl}">
    </head>
    <body>
      <h1>🔥 Loja Senhor Maromba</h1>
      <p>Produtos recomendados e testados nos treinos 💪</p>
  `;

  for (const [nome, lojas] of Object.entries(produtos)) {
    const nomeFormatado = capitalizeWords(nome.replace(/-/g, " "));
    const descricao = lojas[0]?.desc || '';
    
    html += `<div class="produto"><h2>${nomeFormatado}: ${descricao}</h2>`;
    html += `<div class="links">`;
    for (const l of lojas) {
      html += `<a href="/${nome}/${l.loja}">${l.loja}</a>`;
    }
    html += `</div></div>`;
  }

  html += `<footer>Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
           Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a></footer>`;
  html += `</body></html>`;

  return html;
}
