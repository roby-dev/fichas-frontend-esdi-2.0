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
  isLoading = signal(false);
  error = signal<string | null>(null);

  setUser(email: string, roles: string[], mustChangePassword?: boolean) {
    const user: User = { email, roles, mustChangePassword };
    this.user.set(user);
  }

  clearUser() {
    this.user.set(null);
  }

  clear() {
    this.users.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }

  loadUsers() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.userService.getUsers().pipe(
      tap({
        next: (res) => {
          this.users.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los usuarios');
          this.isLoading.set(false);
        },
      })
    );
  }
}
