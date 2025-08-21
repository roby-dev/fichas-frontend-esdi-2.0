import { AuthService } from '@/core/services/auth.service';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn())//&& auth.isAdmin()) {
    return true;

  router.navigate(['/auth']);
  return false;
};
