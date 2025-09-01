import { committeeGuard } from '@/core/guards/committee.guard';
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'dashboard',
    canActivate: [committeeGuard],
    loadComponent: () => import('@/features/dashboard/pages/dashboard/dashboard.component'),
  },
  {
    path: 'children',
    canActivate: [committeeGuard],
    loadComponent: () => import('@/features/children/pages/children/children.component'),
  },
  {
    path: 'committee',
    loadComponent: () => import('@/features/committees/pages/committee/committee.component'),
  },
  {
    path: 'community-halls',
    canActivate: [committeeGuard],
    loadComponent: () => import('@/features/community-halls/pages/community-halls/community-halls.component'),
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
