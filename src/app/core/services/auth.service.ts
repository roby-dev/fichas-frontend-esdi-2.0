import { Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return true;
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return now >= decoded.exp;
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  getDecodedToken(): { email:string, roles:string[] ,exp: number } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
  
  isAdmin(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.roles.includes('admin') ?? false;
  }
}
