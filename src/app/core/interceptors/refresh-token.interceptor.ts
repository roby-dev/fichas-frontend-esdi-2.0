import { HttpClient, HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/constants';

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const refreshUrl = `${environment.apiUrl}/api/v1/auth/refresh`;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          return throwError(() => error);
        }

        return http.post<{ accessToken: string; refreshToken: string }>(refreshUrl, { refreshToken }).pipe(
          switchMap((response) => {
            localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.accessToken}` },
            });
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
