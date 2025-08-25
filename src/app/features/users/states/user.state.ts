import { inject, Injectable, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserState {
  private readonly userService = inject(UsersService);

  users = signal<User[]>([]);
  user = signal<User | null>(null);

  setUser(email: string, roles: string[]) {
    const user: User = { email, roles };
    this.user.set(user);
  }

  clearUser() {
    this.user.set(null);
  }

  clearUsers() {
    this.users.set([]);
  }

  loadUsers() {
    return this.userService.getUsers().pipe(
      tap({
        next: (res) => this.users.set(res),
        error: (err) => console.error(err),
      })
    );
  }
}
