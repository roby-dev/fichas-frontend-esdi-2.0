import { HttpClient, HttpErrorResponse, HttpBackend, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/constants';
import { Router } from '@angular/router';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Usamos HttpBackend para evitar que la llamada de refresh pase por los interceptores
  const backend = inject(HttpBackend);
  const http = new HttpClient(backend);
  const refreshUrl = `${environment.apiUrl}/api/v1/auth/refresh`;
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) return throwError(() => error);

      if (req.url === refreshUrl || req.headers.get('x-refresh-retried')) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return throwError(() => error);
      }

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        // no hay refresh token: limpiar y propagar
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return throwError(() => error);
      }

      return http
        .post<{ accessToken: string; refreshToken: string }>(refreshUrl, { refreshToken })
        .pipe(
          switchMap((response) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
                'x-refresh-retried': 'true',
              },
            });

            return next(clonedReq);
          }),
          catchError((refreshError: HttpErrorResponse) => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            router.navigate(['/auth']);
            return throwError(() => refreshError);
          })
        );
    })
  );
};
