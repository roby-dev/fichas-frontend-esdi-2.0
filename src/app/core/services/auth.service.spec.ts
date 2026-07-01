import { TestBed } from '@angular/core/testing';
import { ACCESS_TOKEN_KEY } from '../constants/constants';
import { AuthService } from './auth.service';

describe('AuthService role helpers', () => {
  let service: AuthService;

  function storeToken(roles: string[]): void {
    const payload = btoa(
      JSON.stringify({
        email: 'at@example.com',
        roles,
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    );

    localStorage.setItem(ACCESS_TOKEN_KEY, `header.${payload}.signature`);
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns true when the decoded token contains the requested AT role', () => {
    storeToken(['user', 'AT']);

    expect(service.hasRole('AT')).toBeTrue();
    expect(service.isTechnicalCompanion()).toBeTrue();
  });

  it('keeps admin checks delegated to the decoded roles payload', () => {
    storeToken(['admin']);

    expect(service.hasRole('admin')).toBeTrue();
    expect(service.isAdmin()).toBeTrue();
    expect(service.isTechnicalCompanion()).toBeFalse();
  });
});
