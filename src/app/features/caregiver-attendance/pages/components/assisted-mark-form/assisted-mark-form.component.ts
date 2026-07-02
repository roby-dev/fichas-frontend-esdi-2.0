import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { CaregiverMotherResponse } from '../../../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../../../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from '../../../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../../../states/caregiver-attendance.state';
import { CaregiverMarkState } from '../../../states/caregiver-mark.state';
import { CaregiverScheduleState } from '../../../states/caregiver-schedule.state';

type AssistedMarkMode = 'admin' | 'user';

interface CaregiverLoadState {
  data: () => CaregiverMotherResponse[];
  loadCaregivers: () => ReturnType<CaregiverAttendanceState['loadCaregivers']>;
}

@Component({
  standalone: true,
  selector: 'app-assisted-mark-form',
  imports: [ButtonComponent],
  templateUrl: './assisted-mark-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistedMarkFormComponent implements OnInit {
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);
  readonly scheduleState = inject(CaregiverScheduleState);
  readonly markState = inject(CaregiverMarkState);

  mode = input.required<AssistedMarkMode>();

  caregiverId = signal('');
  localDate = signal('');
  blockId = signal('');
  entryTime = signal('');
  reason = signal('');
  assignmentError = signal<string | null>(null);

  caregivers = computed(() => this.activeState().data());
  activeBlocks = computed(() => this.scheduleState.versions()[0]?.blocks ?? []);
  isInvalid = computed(() => !this.caregiverId() || !this.localDate() || !this.blockId() || !this.reason().trim());

  ngOnInit(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  onCaregiverChange(caregiverId: string): void {
    this.caregiverId.set(caregiverId);
    this.blockId.set('');
    this.assignmentError.set(null);
    this.scheduleState.clear();
    if (!caregiverId) return;

    this.caregiverAttendanceService.getCaregiverAssignments(caregiverId).subscribe({
      next: (assignments) => {
        const hallId = assignments.find((assignment) => !assignment.validTo)?.communityHallId ?? assignments[0]?.communityHallId;
        if (!hallId) {
          this.assignmentError.set('La madre cuidadora no tiene local comunal asignado.');
          return;
        }
        this.scheduleState.loadByHall(hallId).subscribe({ error: () => undefined });
      },
      error: (err) => this.assignmentError.set(err?.message ?? 'No se pudo cargar el local comunal de la madre cuidadora.'),
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isInvalid()) return;

    this.markState.assisted({
      caregiverId: this.caregiverId(),
      localDate: this.localDate(),
      blockId: this.blockId(),
      entryTime: this.optional(this.entryTime()),
      reason: this.reason().trim(),
    }).subscribe({ error: () => undefined });
  }

  private activeState(): CaregiverLoadState {
    return this.mode() === 'admin' ? this.adminState : this.userState;
  }

  private optional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
}
