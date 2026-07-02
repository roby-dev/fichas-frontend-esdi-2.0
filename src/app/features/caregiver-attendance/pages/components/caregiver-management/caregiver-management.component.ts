import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Observable, of, switchMap } from 'rxjs';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import {
  CaregiverMotherResponse,
  CreateCaregiverMotherRequest,
  TransferCaregiverMotherRequest,
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

interface TransferFormModel {
  communityHallId: string;
  validFrom: string;
}

interface CaregiverLoadState {
  data: () => CaregiverMotherResponse[];
  loadCaregivers: () => ReturnType<CaregiverAttendanceState['loadCaregivers']>;
}

@Component({
  standalone: true,
  selector: 'app-caregiver-management',
  imports: [ButtonComponent, ModalComponent, CaregiverMotherFormComponent, FormField],
  templateUrl: './caregiver-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverManagementComponent implements OnInit {
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  mode = input.required<CaregiverManagementMode>();

  searchTerm = signal('');
  isModalOpen = signal(false);
  selectedCaregiver = signal<CaregiverMotherResponse | null>(null);
  isTransferModalOpen = signal(false);
  transferCaregiver = signal<CaregiverMotherResponse | null>(null);
  isSaving = signal(false);
  saveError = signal<string | null>(null);
  transferError = signal<string | null>(null);

  transferModel = signal<TransferFormModel>({
    communityHallId: '',
    validFrom: this.todayString(),
  });

  transferForm = form(this.transferModel, (schemaPath) => {
    required(schemaPath.communityHallId!, { message: 'Selecciona un local comunal.' });
    required(schemaPath.validFrom!, { message: 'Selecciona la fecha de aplicación.' });
  });

  readonly caregivers = computed(() => this.activeState().data());
  readonly halls = computed(() => this.activeHallState().communityHalls());
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

  get transferCommunityHallIdControl() { return this.transferForm.communityHallId!; }
  get transferValidFromControl() { return this.transferForm.validFrom!; }

  ngOnInit(): void {
    this.loadSelectedState();
    this.ensureHallOptions().subscribe({ error: () => undefined });
  }

  openModal(caregiver: CaregiverMotherResponse | null = null): void {
    if (!caregiver) {
      let opened = false;
      this.ensureHallOptions().subscribe({
        next: () => {
          opened = true;
          this.openForm(null);
        },
        error: () => this.openForm(null),
        complete: () => {
          if (!opened) this.openForm(null);
        },
      });
      return;
    }

    this.openForm(caregiver);
  }

  private openForm(caregiver: CaregiverMotherResponse | null): void {
    this.selectedCaregiver.set(caregiver);
    this.saveError.set(null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCaregiver.set(null);
    this.saveError.set(null);
  }

  openTransferModal(caregiver: CaregiverMotherResponse): void {
    let opened = false;
    this.ensureHallOptions().subscribe({
      next: () => {
        opened = true;
        this.openTransferForm(caregiver);
      },
      error: () => this.openTransferForm(caregiver),
      complete: () => {
        if (!opened) this.openTransferForm(caregiver);
      },
    });
  }

  closeTransferModal(): void {
    this.isTransferModalOpen.set(false);
    this.transferCaregiver.set(null);
    this.transferError.set(null);
  }

  onTransferSubmit(event: Event): void {
    event.preventDefault();
    if (this.transferForm().invalid()) return;

    const caregiver = this.transferCaregiver();
    if (!caregiver) return;

    const value = this.transferModel();
    const request: TransferCaregiverMotherRequest = {
      communityHallId: value.communityHallId,
      validFrom: value.validFrom,
    };

    this.isSaving.set(true);
    this.transferError.set(null);

    this.caregiverAttendanceService.transferCaregiver(caregiver.id, request)
      .pipe(switchMap(() => this.activeState().loadCaregivers()))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeTransferModal();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.transferError.set(err?.message ?? 'No se pudo asignar el local comunal.');
          console.error(err);
        },
      });
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

  private openTransferForm(caregiver: CaregiverMotherResponse): void {
    const halls = this.halls();
    this.transferCaregiver.set(caregiver);
    this.transferError.set(null);
    this.transferModel.set({
      communityHallId: halls.length === 1 ? halls[0].id : '',
      validFrom: this.todayString(),
    });
    this.isTransferModalOpen.set(true);
  }

  private loadSelectedState(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  private activeState(): CaregiverLoadState {
    return this.mode() === 'admin' ? this.adminState : this.userState;
  }

  private activeHallState(): {
    communityHalls: () => CommunityHall[];
    loadCommunityHalls: () => Observable<CommunityHall[]>;
  } {
    return this.mode() === 'admin' ? this.adminHallState : this.userHallState;
  }

  private ensureHallOptions(): Observable<CommunityHall[]> {
    const hallState = this.activeHallState();
    const currentHalls = hallState.communityHalls();
    if (currentHalls.length > 0) return of(currentHalls);

    return hallState.loadCommunityHalls();
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
