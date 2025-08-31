// Endereço base do worker de loja
export const LOJA_BASE = 'https://loja.senhormaromba.com.br/';

/**
 * Gera o link de redirecionamento interno para um produto e loja
 * @param {string} produto - Nome do produto
 * @param {string} loja - Nome da loja
 * @returns {string} URL de redirecionamento interno
 */
export function redirect(produto, loja) {
  const lojaNorm = loja.toLowerCase().replace(/\s+/g, '');
  return `${LOJA_BASE}${produto}/${lojaNorm}`;
}
