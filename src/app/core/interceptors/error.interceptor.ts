import { SnackbarService } from '@/features/shared/components/snackbar/snackbar.service';
import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // normalizar mensaje
      let message = 'Error desconocido';
      try {
        if (err.error) {
          // caso JSON { statusCode, message, ... }
          if (typeof err.error === 'object') {
            if ('message' in err.error && typeof err.error.message === 'string') {
              message = err.error.message;
            } else if ('error' in err.error && typeof err.error.error === 'string') {
              message = err.error.error;
            } else {
              // si viene un objeto de validación u otros
              message = JSON.stringify(err.error);
            }
          } else if (typeof err.error === 'string') {
            // a veces el backend devuelve string JSON o plain text
            try {
              const parsed = JSON.parse(err.error);
              message = parsed?.message ?? err.error;
            } catch {
              message = err.error;
            }
          }
        } else if (err.message) {
          message = err.message;
        } else {
          message = err.statusText ?? `HTTP ${err.status}`;
        }
      } catch {
        message = err.message ?? `HTTP ${err.status}`;
      }

      snackbar.error(message);

      return throwError(() => err);
    })
  );
};
