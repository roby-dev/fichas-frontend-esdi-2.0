import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CaregiverAttendanceExceptionState } from '../../../states/caregiver-attendance-exception.state';
import { CaregiverAttendanceService } from '../../../services/caregiver-attendance.service';
import { CaregiverMotherResponse } from '../../../interfaces/caregiver-mother.interface';
import { AdminCaregiverAttendanceState } from '../../../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../../../states/caregiver-attendance.state';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { AuthService } from '@/core/services/auth.service';
import { switchMap } from 'rxjs';

type ExceptionMode = 'admin' | 'user';
type ExceptionKind = 'holiday' | 'day_off' | 'permission' | 'justification';
type ExceptionScope = 'hall' | 'caregiver';

@Component({
  standalone: true,
  selector: 'app-exception-view',
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './exception-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExceptionViewComponent implements OnInit {
  private readonly exceptionState = inject(CaregiverAttendanceExceptionState);
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  private readonly committeeState = inject(CommitteeState);
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);
  readonly authService = inject(AuthService);

  mode = input.required<ExceptionMode>();

  // Filters
  selectedHallId = signal('');
  selectedDate = signal(this.todayString());

  // Create modal
  isCreateOpen = signal(false);
  createScope = signal<ExceptionScope>('hall');
  createKind = signal<ExceptionKind>('holiday');
  createCaregiverId = signal('');
  createBlockId = signal('');
  createReason = signal('');
  createSubmitted = signal(false);

  // State
  readonly exceptions = this.exceptionState.exceptions;
  readonly isLoading = this.exceptionState.isLoading;
  readonly isSaving = this.exceptionState.isSaving;
  readonly error = this.exceptionState.error;
  readonly saveError = this.exceptionState.saveError;

  readonly halls = computed(() => this.activeHallState().communityHalls());
  readonly caregivers = computed(() => this.activeState().data());

  exceptionKinds: { value: ExceptionKind; label: string }[] = [
    { value: 'holiday', label: 'Feriado' },
    { value: 'day_off', label: 'Día no laborable' },
    { value: 'permission', label: 'Permiso' },
    { value: 'justification', label: 'Justificación' },
  ];

  ngOnInit(): void {
    this.loadHalls();
    this.loadCaregivers();
  }

  onHallChange(event: Event): void {
    this.selectedHallId.set((event.target as HTMLSelectElement).value);
    this.loadExceptions();
  }

  onDateChange(event: Event): void {
    this.selectedDate.set((event.target as HTMLInputElement).value);
    this.loadExceptions();
  }

  loadExceptions(): void {
    const hallId = this.selectedHallId();
    const date = this.selectedDate();
    if (!hallId || !date) return;
    this.exceptionState.loadHallExceptions(hallId, date);
  }

  openCreate(): void {
    this.createScope.set('hall');
    this.createKind.set('holiday');
    this.createCaregiverId.set('');
    this.createBlockId.set('');
    this.createReason.set('');
    this.createSubmitted.set(false);
    this.isCreateOpen.set(true);
  }

  closeCreate(): void {
    this.isCreateOpen.set(false);
  }

  onCreateSubmit(): void {
    this.createSubmitted.set(true);
    const reason = this.createReason().trim();
    if (!reason) return;

    const request = {
      scope: this.createScope(),
      communityHallId: this.selectedHallId(),
      caregiverId: this.createScope() === 'caregiver' ? this.createCaregiverId() : undefined,
      localDate: this.selectedDate(),
      blockId: this.createBlockId() || undefined,
      kind: this.createKind(),
      reason,
    };

    this.exceptionState.createException(request);
    this.closeCreate();
    setTimeout(() => this.loadExceptions(), 500);
  }

  kindLabel(kind: string): string {
    const found = this.exceptionKinds.find((k) => k.value === kind);
    return found?.label ?? kind;
  }

  kindCls(kind: string): string {
    const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ';
    switch (kind) {
      case 'holiday': return base + 'bg-red-100 text-red-700';
      case 'day_off': return base + 'bg-orange-100 text-orange-700';
      case 'permission': return base + 'bg-blue-100 text-blue-700';
      case 'justification': return base + 'bg-purple-100 text-purple-700';
      default: return base + 'bg-gray-100 text-gray-700';
    }
  }

  scopeLabel(scope: string): string {
    return scope === 'hall' ? 'Local' : 'Cuidadora';
  }

  private todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadHalls(): void {
    const state = this.activeHallState();
    if (state.communityHalls().length === 0) {
      state.loadCommunityHalls().subscribe({ error: () => undefined });
    }
  }

  private loadCaregivers(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  private activeHallState(): {
    communityHalls: () => CommunityHall[];
    loadCommunityHalls: () => import('rxjs').Observable<CommunityHall[]>;
  } {
    return this.mode() === 'admin' ? this.adminHallState : this.userHallState;
  }

  private activeState(): {
    data: () => CaregiverMotherResponse[];
    loadCaregivers: () => import('rxjs').Observable<CaregiverMotherResponse[]>;
  } {
    return this.mode() === 'admin' ? this.adminState : this.userState;
  }
}
