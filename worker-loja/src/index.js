import { redirectReal } from '../../shared/redirect.js';
import { renderPage } from './render.js';

const _BASE = 'https://welldonesp.github.io/senhormaromba';
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
        const sitemapRes = await fetch(`${_BASE}/sitemap.xml`);
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

    // Endpoint para robots.txt
    if (url.pathname === '/robots.txt') {
        return Response.redirect(`${_BASE}/robots.txt`, 301);
    }


    // Servir arquivos estáticos da pasta assets
    if (url.pathname.startsWith('/assets/')) {
      try {
        const assetRes = await fetch(`${_BASE}${url.pathname}`);
        if (!assetRes.ok) {
          return new Response('Erro ao carregar asset', { status: 404 });
        }

        // Descobrir content-type pelo tipo do arquivo
        let contentType = 'application/octet-stream';
        if (url.pathname.endsWith('.png')) contentType = 'image/png';
        if (url.pathname.endsWith('.jpg') || url.pathname.endsWith('.jpeg')) contentType = 'image/jpeg';
        if (url.pathname.endsWith('.webp')) contentType = 'image/webp';
        if (url.pathname.endsWith('.json') || url.pathname.endsWith('.webmanifest')) contentType = 'application/manifest+json';

        return new Response(await assetRes.arrayBuffer(), {
          headers: { 'Content-Type': contentType }
        });
      } catch (err) {
        return new Response('Erro interno ao servir asset', { status: 500 });
      }
    }

    // Endpoint para site.webmanifest
    if (url.pathname === '/site.webmanifest') {
      try {
        const manifestRes = await fetch(`${_BASE}/site.webmanifest`);
        if (!manifestRes.ok) {
          return new Response('Erro ao carregar manifest', { status: 500 });
        }
        const manifest = await manifestRes.text();
        return new Response(manifest, {
          headers: { 'Content-Type': 'application/manifest+json; charset=UTF-8' },
        });
      } catch (err) {
        return new Response('Erro interno ao servir manifest', { status: 500 });
      }
    }

    // Endpoint para favicon.ico
    if (url.pathname === '/favicon.ico') {
      try {
        const faviconRes = await fetch(`${_BASE}/assets/favicon.ico`);
        if (!faviconRes.ok) {
          return new Response('Erro ao carregar favicon', { status: 500 });
        }
        const favicon = await faviconRes.arrayBuffer();
        return new Response(favicon, {
          headers: { 'Content-Type': 'image/x-icon' },
        });
      } catch (err) {
        return new Response('Erro interno ao servir favicon', { status: 500 });
      }
    }

    // Página principal da loja
    if (!produto) {
      const html = await renderPage();
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        }
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
