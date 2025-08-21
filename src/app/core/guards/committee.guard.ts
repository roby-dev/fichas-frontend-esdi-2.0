import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '../constants/constants';

export const committeeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const committeeId = localStorage.getItem(COMMITTEE_ID_KEY);
  const committeeName = localStorage.getItem(COMMITTEE_NAME_KEY);

  if (committeeId && committeeName) {
    return true;
  }

  router.navigate(['/admin/committee']);
  return false;
};
