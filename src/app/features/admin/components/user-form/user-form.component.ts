import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { form, required, email, minLength } from '@angular/forms/signals';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import {
  CheckboxGroupComponent,
  CheckboxOption,
} from '@/features/shared/components/checkbox-group/checkbox-group.component';

export interface UserFormValue {
  email: string;
  password: string;
  roles: string[];
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent, CheckboxGroupComponent],
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  isLoading = input<boolean>(false);
  submitted = output<UserFormValue>();
  cancelled = output<void>();

  readonly availableRoles: CheckboxOption[] = [
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' },
  ];

  selectedRoles = signal<string[]>([]);

  private readonly model = signal({ email: '', password: '' });

  readonly userForm = form(this.model, (schema) => {
    required(schema.email, { message: 'El correo es obligatorio' });
    email(schema.email, { message: 'Ingrese un correo válido' });
    required(schema.password, { message: 'La contraseña es obligatoria' });
    minLength(schema.password, 6, { message: 'Mínimo 6 caracteres' });
  });

  get emailControl() {
    return this.userForm.email;
  }

  get passwordControl() {
    return this.userForm.password;
  }

  onRolesChange(roles: string[]): void {
    this.selectedRoles.set(roles);
  }

  onSubmit(): void {
    if (this.userForm().invalid()) return;
    this.submitted.emit({ ...this.model(), roles: this.selectedRoles() });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
