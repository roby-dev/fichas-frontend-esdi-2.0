import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { AuthorizationService } from '@/features/auth/services/authorization.service';
import { catchError, of, tap } from 'rxjs';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { form, required, email, minLength } from '@angular/forms/signals';

@Component({
  standalone: true,
  selector: 'login',
  imports: [RouterLink, InputComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly authorizationService = inject(AuthorizationService);

  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Correo electrónico es obligatorio' });
    email(schemaPath.email, { message: 'Ingrese un correo electrónico válido' });

    required(schemaPath.password, { message: 'La contraseña es obligatoria' });
    minLength(schemaPath.password, 6, { message: 'La contraseña debe de tener un mínimo de 6 dígitos' });
  });

  isLoading = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit(): void {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authorizationService
      .login(this.loginModel())
      .pipe(
        tap((res) => {
          this.authService.setTokens(res.accessToken, res.refreshToken);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.error.set(error.message);
          return of(null);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  get emailControl() {
    return this.loginForm.email;
  }
  get passwordControl() {
    return this.loginForm.password;
  }
}



