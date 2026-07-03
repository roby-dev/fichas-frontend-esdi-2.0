import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
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
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  mode = input.required<CaregiverManagementMode>();

  searchTerm = signal('');
  isModalOpen = signal(false);
  selectedCaregiver = signal<CaregiverMotherResponse | null>(null);
  isSaving = signal(false);
  saveError = signal<string | null>(null);
  transferError = signal<string | null>(null);

  // Retire confirmation modal
  isRetireConfirmOpen = signal(false);
  retireTarget = signal<CaregiverMotherResponse | null>(null);

  // Toolbar transfer modal state
  isToolbarTransferOpen = signal(false);
  toolbarTransferCaregiverId = signal('');
  toolbarTransferHallId = signal('');
  toolbarTransferDate = signal(this.todayString());
  toolbarTransferSubmitted = signal(false);

  readonly caregivers = computed(() => this.activeState().data());
  readonly activeCaregivers = computed(() =>
    this.caregivers().filter((cg) => cg.status === 'active'),
  );
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

  // Toolbar — Asignar local modal

  openToolbarTransfer(): void {
    this.ensureHallOptions().subscribe({
      next: () => {
        this.toolbarTransferCaregiverId.set('');
        this.toolbarTransferHallId.set('');
        this.toolbarTransferDate.set(this.todayString());
        this.toolbarTransferSubmitted.set(false);
        this.transferError.set(null);
        this.isToolbarTransferOpen.set(true);
      },
      error: () => {
        this.toolbarTransferCaregiverId.set('');
        this.toolbarTransferHallId.set('');
        this.toolbarTransferDate.set(this.todayString());
        this.toolbarTransferSubmitted.set(false);
        this.transferError.set(null);
        this.isToolbarTransferOpen.set(true);
      },
    });
  }

  closeToolbarTransfer(): void {
    this.isToolbarTransferOpen.set(false);
    this.transferError.set(null);
  }

  onToolbarTransferCaregiverChange(event: Event): void {
    this.toolbarTransferCaregiverId.set((event.target as HTMLSelectElement).value);
  }

  onToolbarTransferHallChange(event: Event): void {
    this.toolbarTransferHallId.set((event.target as HTMLSelectElement).value);
  }

  onToolbarTransferDateChange(event: Event): void {
    this.toolbarTransferDate.set((event.target as HTMLInputElement).value);
  }

  onToolbarTransferSubmit(event: Event): void {
    event.preventDefault();
    this.toolbarTransferSubmitted.set(true);

    const caregiverId = this.toolbarTransferCaregiverId();
    const communityHallId = this.toolbarTransferHallId();
    const validFrom = this.toolbarTransferDate();

    if (!caregiverId || !communityHallId || !validFrom) return;

    const request: TransferCaregiverMotherRequest = {
      communityHallId,
      validFrom,
    };

    this.isSaving.set(true);
    this.transferError.set(null);

    this.caregiverAttendanceService.transferCaregiver(caregiverId, request)
      .pipe(switchMap(() => this.activeState().loadCaregivers()))
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeToolbarTransfer();
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

  openRetireConfirm(caregiver: CaregiverMotherResponse): void {
    this.retireTarget.set(caregiver);
    this.saveError.set(null);
    this.isRetireConfirmOpen.set(true);
  }

  closeRetireConfirm(): void {
    this.isRetireConfirmOpen.set(false);
    this.retireTarget.set(null);
    this.saveError.set(null);
  }

  confirmRetire(): void {
    const caregiver = this.retireTarget();
    if (!caregiver || caregiver.status !== 'active') return;

    this.isSaving.set(true);
    this.saveError.set(null);

    this.caregiverAttendanceService.updateCaregiver(caregiver.id, {
      status: 'retired',
      endDate: this.todayString(),
    }).pipe(switchMap(() => this.activeState().loadCaregivers())).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.closeRetireConfirm();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(err?.message ?? 'No se pudo retirar la madre cuidadora.');
        console.error(err);
      },
    });
  }

  reactivateCaregiver(caregiver: CaregiverMotherResponse): void {
    if (caregiver.status !== 'retired') return;

    this.isSaving.set(true);
    this.saveError.set(null);

    this.caregiverAttendanceService.updateCaregiver(caregiver.id, {
      status: 'active',
    }).pipe(switchMap(() => this.activeState().loadCaregivers())).subscribe({
      next: () => {
        this.isSaving.set(false);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveError.set(err?.message ?? 'No se pudo reactivar la madre cuidadora.');
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
