import { CreateUpdateChildRequest } from '@/features/children/interfaces/create-update-child-request.interface';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { toDateInputValue } from '@/features/shared/utilts';

import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { InputComponent } from '@/features/shared/components/input/input.component';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { form, required, minLength, maxLength, FormField } from '@angular/forms/signals';

@Component({
  standalone: true,
  selector: 'app-child-form',
  imports: [InputComponent, ButtonComponent, FormField],
  templateUrl: './child-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildFormComponent implements OnInit {
  isLoading = input.required<boolean>();
  child = input<CreateUpdateChildRequest | null>(null);
  communityHalls = input.required<CommunityHall[]>();

  saveChildEvent = output<CreateUpdateChildRequest>();

  childModel = signal<Partial<CreateUpdateChildRequest>>({
    documentNumber: '',
    firstName: '',
    lastName: '',
    birthday: null as any,
    admissionDate: null as any,
    communityHallId: '',
  });

  form = form(this.childModel, (schemaPath) => {
    required(schemaPath.documentNumber!, { message: 'Documento requerido (mínimo 8 dígitos)' });
    minLength(schemaPath.documentNumber!, 8, { message: 'Debe tener al menos 8 dígitos' });
    maxLength(schemaPath.documentNumber!, 8, { message: 'Debe tener máximo 8 dígitos' });

    required(schemaPath.firstName!, { message: 'El nombre es obligatorio' });
    required(schemaPath.lastName!, { message: 'El apellido es obligatorio' });
    required(schemaPath.birthday!, { message: 'La fecha de nacimiento es obligatoria' });
    required(schemaPath.admissionDate!, { message: 'La fecha de admisión es obligatoria' });
    required(schemaPath.communityHallId!, { message: 'El local comunal es obligatorio' });
  });

  ngOnInit(): void {
    // si viene un child (modo update), seteamos valores
    const c = this.child();
    if (c) {
      this.childModel.set({
        documentNumber: c.documentNumber ?? '',
        firstName: c.firstName ?? '',
        lastName: c.lastName ?? '',
        birthday: c.birthday ? toDateInputValue(c.birthday) as any : null,
        admissionDate: c.admissionDate ? toDateInputValue(c.admissionDate) as any : null,
        communityHallId: c.communityHallId ?? '',
      });
    }
  }

  get documentNumberControl() { return this.form.documentNumber!; }
  get firstNameControl() { return this.form.firstName!; }
  get lastNameControl() { return this.form.lastName!; }
  get birthdayControl() { return this.form.birthday!; }
  get admissionDateControl() { return this.form.admissionDate!; }
  get communityHallIdControl() { return this.form.communityHallId!; }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) return;
    
    const value = this.childModel();

    const request: CreateUpdateChildRequest = {
      documentNumber: value.documentNumber ?? '',
      firstName: value.firstName ?? '',
      lastName: value.lastName ?? '',
      birthday: value.birthday instanceof Date ? value.birthday : new Date(value.birthday!),
      admissionDate: value.admissionDate instanceof Date ? value.admissionDate : new Date(value.admissionDate!),
      communityHallId: value.communityHallId ?? '',
    };

    this.saveChildEvent.emit(request);
  }
}





