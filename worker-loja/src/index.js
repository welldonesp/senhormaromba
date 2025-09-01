import { redirectReal } from '../../shared/redirect.js';
import { renderPage } from './render.js';

const ASSETS_BASE = 'https://welldonesp.github.io/senhormaromba/assets';
const LOJA_URL = 'https://loja.senhormaromba.com.br/';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(p => p);
    const produto = parts[0];
    const loja = parts[1];

    // Endpoint para sitemap.xml
    if (url.pathname === '/sitemap.xml') {
      try {
        const sitemapRes = await fetch(`${ASSETS_BASE}/sitemap.xml`);
        if (!sitemapRes.ok) {
          return new Response('Erro ao carregar sitemap', { status: 500 });
        }
        const sitemap = await sitemapRes.text();
        return new Response(sitemap, {
          headers: { 'Content-Type': 'application/xml; charset=UTF-8' },
        });
      } catch (err) {
        return new Response('Erro interno ao servir sitemap', { status: 500 });
      }
    }

    // Página principal da loja
    if (!produto) {
      const html = await renderPage();
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }

    // Redirecionamento real para o produto
    const destino = await redirectReal(produto, loja); // <- assíncrono
    if (!destino) {
      // Se o produto não existir, redireciona para a loja (301)
      return new Response(null, {
        status: 301,
        headers: {
          'Location': LOJA_URL,
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        }
      });
    }

    return new Response(null, {
      status: 301,
      headers: {
        'Location': destino,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  }
};
