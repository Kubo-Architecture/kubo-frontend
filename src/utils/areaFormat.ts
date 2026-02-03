/**
 * Formato BR: ponto como separador de milhar, vírgula como decimal.
 * Ex.: 28.800 = 28800 m², 28.800,5 = 28800,5 m²
 */

/**
 * Converte string no formato BR (ex.: "28.800" ou "28.800,5") em número.
 */
export function parseBrazilianArea(value: string | undefined | null): number {
  if (value == null || String(value).trim() === '') return NaN;
  const s = String(value).trim();
  if (s.includes(',')) {
    const parts = s.split(',');
    const decimalPart = parts.pop() ?? '';
    const integerPart = (parts.join('') || '0').replace(/\./g, '');
    const combined = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    const n = parseFloat(combined);
    return isNaN(n) ? NaN : n;
  }
  const withoutDots = s.replace(/\./g, '');
  const n = parseFloat(withoutDots);
  return isNaN(n) ? NaN : n;
}

/**
 * Formata número para exibição no padrão BR (milhar com ponto, decimal com vírgula).
 * Preserva zeros: 28800 → "28.800", 28800.5 → "28.800,5"
 */
export function formatBrazilianArea(value: number | string | undefined | null): string {
  const n = typeof value === 'number' ? value : parseBrazilianArea(String(value ?? ''));
  if (isNaN(n) || n < 0) return '';
  const hasDecimals = n % 1 !== 0;
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: hasDecimals ? 1 : 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Permite apenas caracteres válidos para área (dígitos, ponto para milhar, vírgula para decimal).
 */
export function sanitizeAreaInput(value: string): string {
  return value.replace(/[^\d.,]/g, '').replace(/,+/g, ',');
}
