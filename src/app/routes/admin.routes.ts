import { adminGuard } from '@/core/guards/admin.guard';
import { authGuard } from '@/core/guards/auth.guard';
import { committeeGuard } from '@/core/guards/committee.guard';
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('@/features/dashboard/pages/dashboard/dashboard.component'),
  },
  {
    path: 'children',
    loadComponent: () => import('@/features/children/pages/children/children.component'),
  },
  {
    path: 'committee',
    loadComponent: () => import('@/features/committees/pages/committee/committee.component'),
  },
  {
    path: 'community-halls',
    loadComponent: () => import('@/features/community-halls/pages/community-halls/community-halls.component'),
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('@/features/unauthorized/pages/unauthorized/unauthorized.component'),
  },
  {
    path: 'audit',
    loadComponent: () => import('@/features/admin/pages/audit/audit.component'),
  },
  {
    path: 'sessions',
    loadComponent: () => import('@/features/admin/pages/sessions/sessions.component'),
  },
  {
    path: 'users',
    loadComponent: () => import('@/features/admin/pages/users/users.component'),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
