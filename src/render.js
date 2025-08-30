import produtos from './produtos.json' assert { type: 'json' };

export async function renderPage() {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Loja Senhor Maromba</title>
      <style>
        body { font-family: Arial, sans-serif; background: #111; color: #eee; padding: 20px; }
        h1 { color: #f33; }
        .produto { margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #444; }
        .links a { margin-right: 10px; color: #4af; text-decoration: none; }
        .links a:hover { text-decoration: underline; }
        footer { margin-top: 50px; font-size: 0.9em; text-align: center; display:block; }
      </style>
    </head>
    <body>
      <h1>🔥 Loja Senhor Maromba</h1>
      <p>Produtos recomendados e testados nos treinos 💪</p>
  `;

  for (const [nome, lojas] of Object.entries(produtos)) {
    html += `<div class="produto"><h2>${nome.replace(/-/g, " ")}</h2>`;
    html += `<div class="links">`;
    for (const l of lojas) {
      html += `<a href="/${nome}/${l.loja}">${l.loja}</a> - ${l.desc}`;
    }
    html += `</div></div>`;
  }

  html += `<footer>Todos os links são afiliados, o que me ajuda a continuar produzindo conteúdo.<br>
           Conheça o canal: <a href="https://www.youtube.com/@SenhorMaromba" target="_blank">Senhor Maromba</a></footer>`;
  html += `</body></html>`;

  return html;
}
