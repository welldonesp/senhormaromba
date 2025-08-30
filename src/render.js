export async function renderPage() {
  const res = await fetch('https://raw.githubusercontent.com/welldonesp/senhormaromba/main/produtos.json');
  const produtos = await res.json();

  let html = `<html><head><meta charset="UTF-8"><title>Loja Senhor Maromba</title></head><body>`;
  html += `<h1>🔥 Loja Senhor Maromba</h1>`;

  for (const [nome, info] of Object.entries(produtos)) {
    html += `<div><h2>${nome.replace(/-/g,' ')}</h2><p>${info.desc}</p>`;
    for (const [loja, url] of Object.entries(info.links)) {
      html += `<a href="/${nome}/${loja}">${loja}</a> `;
    }
    html += `</div>`;
  }

  html += `<footer>Todos os links são afiliados. Conheça o canal <a href="https://www.youtube.com/@SenhorMaromba">Senhor Maromba</a></footer>`;
  html += `</body></html>`;

  return html;
}
