import { Routes } from '@angular/router';
import AuthLayoutComponent from '@/layouts/auth-layout/pages/auth-layout/auth-layout.component';
import AdminLayoutComponent from '@/layouts/admin-layout/pages/admin-layout/admin-layout.component';
import EmptyLayoutComponent from '@/layouts/empty-layout/pages/empty-layout/empty-layout.component';
import { redirectGuard } from '@/core/guards/redirect.guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('@/layouts/auth-layout/pages/auth-layout/auth-layout.component'),
    loadChildren: () => import('./auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadComponent: () => import('@/layouts/admin-layout/pages/admin-layout/admin-layout.component'),
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
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
