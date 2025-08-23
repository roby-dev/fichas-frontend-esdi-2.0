import { Routes } from "@angular/router";

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@/features/auth/login/pages/login/login.component'),
  },
  {
    path: 'register',
    loadComponent: () => import('@/features/auth/register/pages/register/register.component'),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];
