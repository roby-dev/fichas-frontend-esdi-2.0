import { ChangeDetectionStrategy, Component, OnInit, input, output, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import {
  CaregiverMotherResponse,
  CreateCaregiverMotherRequest,
  UpdateCaregiverMotherRequest,
} from '../../../interfaces/caregiver-mother.interface';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { InputComponent } from '@/features/shared/components/input/input.component';

type CaregiverSaveRequest = CreateCaregiverMotherRequest | UpdateCaregiverMotherRequest;

interface CaregiverFormModel {
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  startDate: string;
}

@Component({
  standalone: true,
  selector: 'app-caregiver-mother-form',
  imports: [ButtonComponent, InputComponent, FormField],
  templateUrl: './caregiver-mother-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverMotherFormComponent implements OnInit {
  isLoading = input.required<boolean>();
  caregiver = input<CaregiverMotherResponse | null>(null);
  saveCaregiverEvent = output<CaregiverSaveRequest>();

  caregiverModel = signal<CaregiverFormModel>({
    documentType: 'DNI',
    documentNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    startDate: '',
  });

  form = form(this.caregiverModel, (schemaPath) => {
    required(schemaPath.documentNumber!, { message: 'Número de documento requerido' });
    required(schemaPath.firstName!, { message: 'Nombres requeridos' });
    required(schemaPath.lastName!, { message: 'Apellidos requeridos' });
    required(schemaPath.startDate!, { message: 'Fecha de inicio requerida' });
  });

  ngOnInit(): void {
    const caregiver = this.caregiver();
    if (!caregiver) return;

    this.caregiverModel.set({
      documentType: caregiver.documentType || 'DNI',
      documentNumber: caregiver.documentNumber,
      firstName: caregiver.firstName,
      lastName: caregiver.lastName,
      phone: caregiver.phone ?? '',
      startDate: this.dateInputValue(caregiver.startDate),
    });
  }

  get documentTypeControl() { return this.form.documentType!; }
  get documentNumberControl() { return this.form.documentNumber!; }
  get firstNameControl() { return this.form.firstName!; }
  get lastNameControl() { return this.form.lastName!; }
  get phoneControl() { return this.form.phone!; }
  get startDateControl() { return this.form.startDate!; }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.caregiverModel();
    const request: CaregiverSaveRequest = {
      documentType: this.optional(value.documentType),
      documentNumber: value.documentNumber,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: this.optional(value.phone),
      startDate: value.startDate,
    };

    this.saveCaregiverEvent.emit(request);
  }

  private dateInputValue(value: string | null | undefined): string {
    return value?.slice(0, 10) ?? '';
  }

  private optional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
}
