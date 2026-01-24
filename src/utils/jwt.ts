/**
 * Decodifica um JWT token e retorna o payload
 * @param token - O token JWT
 * @returns O payload decodificado ou null se inválido
 */
export function decodeJWT(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Extrai o userId do token JWT armazenado no localStorage
 * @returns O userId ou null se não encontrado
 */
export function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const decoded = decodeJWT(token);
  if (!decoded || !decoded.sub) {
    return null;
  }

  return decoded.sub;
}

/**
 * Verifica se o token JWT está expirado
 * @param token - O token JWT (opcional, usa do localStorage se não fornecido)
 * @returns true se expirado, false caso contrário
 */
export function isTokenExpired(token?: string): boolean {
  const tokenToCheck = token || localStorage.getItem('token');
  if (!tokenToCheck) {
    return true;
  }

  const decoded = decodeJWT(tokenToCheck);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const expirationTime = decoded.exp * 1000; // Converter para milissegundos
  return Date.now() >= expirationTime;
}
