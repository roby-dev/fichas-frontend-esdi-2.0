import {
  ApplicationConfig,
  LOCALE_ID,
  provideZonelessChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { refreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { environment } from '../environments/environment';

const wsConfig: SocketIoConfig = {
  url: environment.wsUrl,
  options: { transports: ['websocket'], upgrade: true },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor, refreshTokenInterceptor, errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(SocketIoModule.forRoot(wsConfig)),
  ],
};
