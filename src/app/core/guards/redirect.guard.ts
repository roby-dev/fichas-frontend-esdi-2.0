import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const redirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const decoded = authService.getDecodedToken();
    if (decoded?.mustChangePassword) {
      return router.parseUrl('/auth/change-password');
    }
    return authService.isAdmin() ? router.parseUrl('/admin') : router.parseUrl('/user');
  }
  return router.parseUrl('/auth/login');
};
