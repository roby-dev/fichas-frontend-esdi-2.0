import { UsersService } from '@/features/users/services/users.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { form, required, email, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-register',
  imports: [RouterLink, InputComponent],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private readonly userService = inject(UsersService);

  registerModel = signal({
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Correo electrónico es obligatorio' });
    email(schemaPath.email, { message: 'Ingrese un correo electrónico válido' });

    required(schemaPath.password, { message: 'La contraseña es obligatoria' });
    minLength(schemaPath.password, 6, { message: 'La contraseña debe de tener un mínimo de 6 dígitos' });
  });

  isLoading = signal<boolean>(false);
  error = signal<string>('');
  isUserCreated = signal<boolean>(false);

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.registerForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.userService.createUser(this.registerModel()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isUserCreated.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  get emailControl() {
    return this.registerForm.email;
  }
  get passwordControl() {
    return this.registerForm.password;
  }
}


