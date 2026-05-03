import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth.service';
import { AuthorizationService } from '@/features/auth/services/authorization.service';
import { catchError, of, tap } from 'rxjs';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { form, required, minLength } from '@angular/forms/signals';
import { SnackbarService } from '@/features/shared/components/snackbar/snackbar.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly snackbar = inject(SnackbarService);

  formModel = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  changePasswordForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.currentPassword, { message: 'La contraseña actual es obligatoria' });
    required(schemaPath.newPassword, { message: 'La nueva contraseña es obligatoria' });
    minLength(schemaPath.newPassword, 6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' });
    required(schemaPath.confirmPassword, { message: 'Confirmá la nueva contraseña' });
  });

  isLoading = signal<boolean>(false);
  mismatchError = computed(() => {
    const { newPassword, confirmPassword } = this.formModel();
    if (!confirmPassword) return '';
    return newPassword !== confirmPassword ? 'Las contraseñas no coinciden' : '';
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.changePasswordForm().invalid() || this.mismatchError()) {
      return;
    }

    this.isLoading.set(true);
    const { currentPassword, newPassword } = this.formModel();

    this.authorizationService
      .changePassword({ currentPassword, newPassword })
      .pipe(
        tap((res) => {
          this.isLoading.set(false);
          if (res.mustReauthenticate) {
            // Backend killed sessions
            this.authService.setTokens('', '');
            this.snackbar.success('Contraseña actualizada. Iniciá sesión nuevamente.');
            this.router.navigate(['/auth/login']);
          } else {
            // Keep session
            this.snackbar.success('Contraseña actualizada correctamente.');
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/user']);
            }
          }
        }),
        catchError((error) => {
          this.isLoading.set(false);
          // Backend should return 400 SAME_PASSWORD or 401. Error interceptor already shows toast.
          return of(null);
        })
      )
      .subscribe();
  }

  logout(): void {
    this.authorizationService.logout().subscribe(() => {
      this.authService.setTokens('', '');
      this.router.navigate(['/auth/login']);
    });
  }

  get currentPasswordControl() {
    return this.changePasswordForm.currentPassword;
  }
  get newPasswordControl() {
    return this.changePasswordForm.newPassword;
  }
  get confirmPasswordControl() {
    return this.changePasswordForm.confirmPassword;
  }
}
