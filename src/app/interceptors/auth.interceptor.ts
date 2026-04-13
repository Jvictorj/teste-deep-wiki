import { HttpInterceptorFn } from '@angular/common/http';

function lerTokenSessao(): string {
  if (typeof sessionStorage === 'undefined') {
    return '';
  }

  const tokenSalvo = sessionStorage.getItem('token') ?? '';
  const usuarioSalvo = sessionStorage.getItem('usuario') ?? '';
  if (!tokenSalvo.trim()) {
    // Fallback para sessões antigas: token pode existir só dentro de `usuario`.
    try {
      const usuario = JSON.parse(atob(usuarioSalvo));
      const tokenUsuario =
        usuario?.token ??
        usuario?.accessToken ??
        usuario?.access_token ??
        usuario?.jwt ??
        '';
      return `${tokenUsuario}`.trim();
    } catch {
      return '';
    }
  }

  // Compatibilidade com token legado salvo em base64.
  try {
    const parseado = JSON.parse(atob(tokenSalvo));
    const token = `${parseado ?? ''}`.trim();
    if (token) {
      return token;
    }
  } catch {
    // segue para os próximos fallbacks
  }

  try {
    const decodificado = atob(tokenSalvo).trim();
    if (decodificado) {
      // Pode ter sido salvo token "legado" como base64 do id.
      // Nesse caso tenta recuperar o JWT a partir do objeto `usuario`.
      if (!decodificado.includes('.')) {
        try {
          const usuario = JSON.parse(atob(usuarioSalvo));
          const tokenUsuario =
            usuario?.token ??
            usuario?.accessToken ??
            usuario?.access_token ??
            usuario?.jwt ??
            '';
          if (`${tokenUsuario}`.trim()) {
            return `${tokenUsuario}`.trim();
          }
        } catch {
          // mantém fallback padrão
        }
      }
      return decodificado;
    }
  } catch {
    // segue para retorno bruto
  }

  return tokenSalvo.trim();
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = lerTokenSessao();

  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  const authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return next(
    req.clone({
      setHeaders: {
        Authorization: authorization,
      },
    })
  );
};
