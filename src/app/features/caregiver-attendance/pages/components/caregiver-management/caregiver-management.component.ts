import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import {
  CaregiverMotherResponse,
  CreateCaregiverMotherRequest,
  UpdateCaregiverMotherRequest,
} from '../../../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../../../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from '../../../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../../../states/caregiver-attendance.state';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { CaregiverMotherFormComponent } from '../caregiver-mother-form/caregiver-mother-form.component';

type CaregiverManagementMode = 'admin' | 'user';
type CaregiverSaveRequest = CreateCaregiverMotherRequest | UpdateCaregiverMotherRequest;

interface CaregiverLoadState {
  data: () => CaregiverMotherResponse[];
  loadCaregivers: () => ReturnType<CaregiverAttendanceState['loadCaregivers']>;
}

@Component({
  standalone: true,
  selector: 'app-caregiver-management',
  imports: [ButtonComponent, ModalComponent, CaregiverMotherFormComponent],
  templateUrl: './caregiver-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverManagementComponent implements OnInit {
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  mode = input.required<CaregiverManagementMode>();

  searchTerm = signal('');
  isModalOpen = signal(false);
  selectedCaregiver = signal<CaregiverMotherResponse | null>(null);
  isSaving = signal(false);
  saveError = signal<string | null>(null);

  readonly caregivers = computed(() => this.activeState().data());
  readonly filteredCaregivers = computed(() => {
    const term = this.normalize(this.searchTerm());
    if (!term) return this.caregivers();

    return this.caregivers().filter((caregiver) => {
      return [
        caregiver.documentNumber,
        caregiver.firstName,
        caregiver.lastName,
        caregiver.fullName,
      ].some((value) => this.normalize(value).includes(term));
    });
  });

  ngOnInit(): void {
    this.loadSelectedState();
  }

  openModal(caregiver: CaregiverMotherResponse | null = null): void {
    this.selectedCaregiver.set(caregiver);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCaregiver.set(null);
    this.saveError.set(null);
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  onCaregiverSaved(request: CaregiverSaveRequest): void {
    this.isSaving.set(true);
    this.saveError.set(null);

    const selected = this.selectedCaregiver();
    const request$ = selected
      ? this.caregiverAttendanceService.updateCaregiver(selected.id, request)
      : this.caregiverAttendanceService.createCaregiver(request as CreateCaregiverMotherRequest);

    request$.pipe(switchMap(() => this.activeState().loadCaregivers())).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeModal();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(err?.message ?? 'No se pudo guardar la madre cuidadora.');
        console.error(err);
      },
    });
  }

  retireCaregiver(caregiver: CaregiverMotherResponse): void {
    if (caregiver.status !== 'active') return;

    this.isSaving.set(true);
    this.saveError.set(null);

    this.caregiverAttendanceService.updateCaregiver(caregiver.id, {
      status: 'retired',
      endDate: this.todayString(),
    }).pipe(switchMap(() => this.activeState().loadCaregivers())).subscribe({
      next: () => {
        this.isSaving.set(false);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(err?.message ?? 'No se pudo retirar la madre cuidadora.');
        console.error(err);
      },
    });
  }

  statusLabel(caregiver: CaregiverMotherResponse): string {
    return caregiver.status === 'active' ? 'Activa' : 'Retirada';
  }

  private loadSelectedState(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  private activeState(): CaregiverLoadState {
    return this.mode() === 'admin' ? this.adminState : this.userState;
  }

  private normalize(value: string | null | undefined): string {
    return (value ?? '').toLowerCase().trim();
  }

  private todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
