import { handleRedirect } from './redirect.js';
import { renderPage } from './page.js';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(p => p);
    const produto = parts[0];
    const loja = parts[1];

    // Caso seja "/" → renderiza a página
    if (!produto) {
      return renderPage();
    }

    // Caso contrário → redireciona
    return handleRedirect(produto, loja);
  }
}
