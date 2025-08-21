import { adminGuard } from '@/core/guards/admin.guard';
import { committeeGuard } from '@/core/guards/committee.guard';
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    canActivate: [adminGuard, committeeGuard],
    loadComponent: () => import('@/features/dashboard/pages/dashboard/dashboard.component'),
  },
  {
    path: 'committee',
    canActivate: [adminGuard],
    loadComponent: () => import('@/features/committees/pages/committee/committee.component'),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('@/features/unauthorized/pages/unauthorized/unauthorized.component'),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
