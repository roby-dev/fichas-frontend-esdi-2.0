import { Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserState {
  user = signal<User | null>(null);

  setUser(email: string, roles: string[]) {
    const user: User = { email, roles };
    this.user.set(user);
  }

  clearUser() {
    this.user.set(null);
  }
}
