import { handleRedirect } from "./redirect.js";
import { handlePage } from "./render.js";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.split("/").filter(p => p);
    const produto = path[0];
    const loja = path[1];

    if (!produto) {
      return handlePage();
    }

    return handleRedirect(produto, loja);
  }
};
