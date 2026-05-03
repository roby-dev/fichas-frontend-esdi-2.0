import { Component, computed, input, output, signal } from '@angular/core';
import { form, required, minLength } from '@angular/forms/signals';
import { InputComponent } from '@/features/shared/components/input/input.component';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent {
  isLoading = input<boolean>(false);

  submitted = output<{ temporaryPassword: string }>();
  cancelled = output<void>();

  formModel = signal({
    temporaryPassword: '',
    confirmPassword: '',
  });

  resetForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.temporaryPassword, { message: 'La contraseña temporal es obligatoria' });
    minLength(schemaPath.temporaryPassword, 6, { message: 'Mínimo 6 caracteres' });
    required(schemaPath.confirmPassword, { message: 'Confirmá la contraseña' });
    minLength(schemaPath.confirmPassword, 6, { message: 'Mínimo 6 caracteres' });
  });

  mismatchError = computed(() => {
    const { temporaryPassword, confirmPassword } = this.formModel();
    if (!confirmPassword) return '';
    return temporaryPassword !== confirmPassword ? 'Las contraseñas no coinciden' : '';
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.resetForm().invalid() || this.mismatchError()) return;
    this.submitted.emit({ temporaryPassword: this.formModel().temporaryPassword });
  }

  get temporaryPasswordControl() {
    return this.resetForm.temporaryPassword;
  }

  get confirmPasswordControl() {
    return this.resetForm.confirmPassword;
  }
}
