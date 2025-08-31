import { renderAdminPage } from './render-admin.js';

addEventListener('fetch', event => {
  event.respondWith(
    renderAdminPage().then(html => 
      new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } })
    )
  );
});
