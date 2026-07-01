import { committeeGuard } from '@/core/guards/committee.guard';
import { ADMIN_ROUTES } from './admin.routes';
import { LAYOUT_ROUTES } from './layout.routes';
import { USER_ROUTES } from './user.routes';

describe('caregiver attendance route seams', () => {
  it('adds an admin lazy route for the authenticated placeholder', () => {
    const route = ADMIN_ROUTES.find((item) => item.path === 'caregiver-attendance');

    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
  });

  it('adds a user or AT lazy route that keeps the committee guard convention', () => {
    const route = USER_ROUTES.find((item) => item.path === 'caregiver-attendance');

    expect(route).toBeDefined();
    expect(route?.loadComponent).toBeDefined();
    expect(route?.canActivate).toEqual([committeeGuard]);
  });

  it('adds public self-service before wildcard without authenticated guards or layouts', () => {
    const publicIndex = LAYOUT_ROUTES.findIndex((item) => item.path === 'caregiver-attendance/self-service');
    const wildcardIndex = LAYOUT_ROUTES.findIndex((item) => item.path === '**');
    const route = LAYOUT_ROUTES[publicIndex];

    expect(publicIndex).toBeGreaterThanOrEqual(0);
    expect(publicIndex).toBeLessThan(wildcardIndex);
    expect(route.loadComponent).toBeDefined();
    expect(route.canActivate).toBeUndefined();
    expect(route.canActivateChild).toBeUndefined();
    expect(route.loadChildren).toBeUndefined();
  });
});
