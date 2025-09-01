import { Routes } from '@angular/router';
import { redirectGuard } from '@/core/guards/redirect.guard';
import { authGuard } from '@/core/guards/auth.guard';
import { adminGuard } from '@/core/guards/admin.guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('@/layouts/auth-layout/pages/auth-layout/auth-layout.component'),
    loadChildren: () => import('./auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivateChild: [authGuard, adminGuard],
    loadComponent: () => import('@/layouts/admin-layout/pages/admin-layout/admin-layout.component'),
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'user',
    canActivateChild: [authGuard],
    loadComponent: () => import('@/layouts/user-layout/pages/user-layout/user-layout.component'),
    loadChildren: () => import('./user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: '',
    loadComponent: () => import('@/layouts/empty-layout/pages/empty-layout/empty-layout.component'),
    canActivate: [redirectGuard],
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
