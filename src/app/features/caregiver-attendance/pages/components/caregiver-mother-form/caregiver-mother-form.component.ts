import { ChangeDetectionStrategy, Component, OnInit, input, output, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
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
  communityHallId: string;
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
  halls = input<CommunityHall[]>([]);
  saveCaregiverEvent = output<CaregiverSaveRequest>();

  caregiverModel = signal<CaregiverFormModel>({
    documentType: 'DNI',
    documentNumber: '',
    firstName: '',
    lastName: '',
    phone: '',
    startDate: this.todayString(),
    communityHallId: '',
  });

  form = form(this.caregiverModel, (schemaPath) => {
    required(schemaPath.documentNumber!, { message: 'Número de documento requerido' });
    required(schemaPath.firstName!, { message: 'Nombres requeridos' });
    required(schemaPath.lastName!, { message: 'Apellidos requeridos' });
    required(schemaPath.startDate!, { message: 'Fecha de inicio requerida' });
    required(schemaPath.communityHallId!, { message: 'Selecciona un local comunal.' });
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
      communityHallId: 'existing-assignment',
    });
  }

  get documentTypeControl() { return this.form.documentType!; }
  get documentNumberControl() { return this.form.documentNumber!; }
  get firstNameControl() { return this.form.firstName!; }
  get lastNameControl() { return this.form.lastName!; }
  get phoneControl() { return this.form.phone!; }
  get startDateControl() { return this.form.startDate!; }
  get communityHallIdControl() { return this.form.communityHallId!; }

  isCreateMode(): boolean {
    return !this.caregiver();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form().invalid()) return;

    const value = this.caregiverModel();
    const request: UpdateCaregiverMotherRequest = {
      documentType: this.optional(value.documentType),
      documentNumber: value.documentNumber,
      firstName: value.firstName,
      lastName: value.lastName,
      phone: this.optional(value.phone),
      startDate: value.startDate,
    };

    if (this.isCreateMode()) {
      this.saveCaregiverEvent.emit({
        ...request,
        communityHallId: value.communityHallId,
      } as CreateCaregiverMotherRequest);
      return;
    }

    this.saveCaregiverEvent.emit(request);
  }

  private dateInputValue(value: string | null | undefined): string {
    return value?.slice(0, 10) ?? '';
  }

  private todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private optional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
}
