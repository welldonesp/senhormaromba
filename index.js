export default {
  async fetch(request) {
    const url = new URL(request.url)

    const redirects = {
      "/strap-tradicional": "https://www.mercadolivre.com.br/exemplo",
      "/strap-figure-eight": "https://www.amazon.com.br/exemplo",
      "/luvas-treino": "https://www.mercadolivre.com.br/exemplo2",
      "/magnesio-liquido": "https://www.amazon.com.br/exemplo2"
    }

    const destination = redirects[url.pathname]
    if (destination) {
      return Response.redirect(destination, 301)
    } else {
      return new Response('Link não encontrado', { status: 404 })
    }
  }
}
