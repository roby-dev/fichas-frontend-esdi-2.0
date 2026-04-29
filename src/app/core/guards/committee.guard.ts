import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '../constants/constants';
import { AuthService } from '../services/auth.service';

export const committeeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const committeeId = localStorage.getItem(COMMITTEE_ID_KEY);
  const committeeName = localStorage.getItem(COMMITTEE_NAME_KEY);

  if (committeeId && committeeName) {
    return true;
  }

  const base = auth.isAdmin() ? '/admin' : '/user';
  router.navigate([`${base}/committee`]);
  return false;
};
