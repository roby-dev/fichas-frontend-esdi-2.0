import type { HttpInterceptorFn } from '@angular/common/http';
import { ACCESS_TOKEN_KEY } from '../constants/constants';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedPath = '/api/v1/auth/login';

  if (req.url.includes(excludedPath)) {
    return next(req);
  }

  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authReq);
};
