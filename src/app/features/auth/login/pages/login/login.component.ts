import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@/core/services/auth.service';
import { AuthorizationService } from '@/features/auth/services/authorization.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authorizationService = inject(AuthorizationService);

  loginForm: FormGroup;
  isLoading = signal<boolean>(false);
  error = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.authorizationService
      .login(this.loginForm.value)
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
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }
}
