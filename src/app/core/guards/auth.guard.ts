import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    const decoded = auth.getDecodedToken();
    if (decoded?.mustChangePassword) {
      if (state.url !== '/auth/change-password') {
        router.navigate(['/auth/change-password']);
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  router.navigate(['/auth/login']);
  return false;
};
