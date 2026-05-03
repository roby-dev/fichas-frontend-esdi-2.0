import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@/features/auth/login/pages/login/login.component'),
  },
  {
    path: 'change-password',
    loadComponent: () => import('@/features/auth/change-password/pages/change-password/change-password.component'),
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
