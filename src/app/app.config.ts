import { ApplicationConfig, LOCALE_ID, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authTokenInterceptor, refreshTokenInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-ES' },
  ],
};
