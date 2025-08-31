import { redirect } from './redirect.js';
import { renderPage } from './render.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(p => p);
    const produto = parts[0];
    const loja = parts[1];

    if (!produto) {
      const html = await renderPage();
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
    }

    const destino = await redirect(produto, loja);
    if (!destino) return new Response('Produto não encontrado', { status: 404 });

    return new Response(null, {
      status: 301,
      headers: { 'Location': destino, 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' }
    });
  }
};
