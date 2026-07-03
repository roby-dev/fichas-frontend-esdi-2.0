import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import {
  CaregiverHallAssignment,
  CaregiverMotherResponse,
} from '../../../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../../../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from '../../../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../../../states/caregiver-attendance.state';

type AssignmentHistoryMode = 'admin' | 'user';

interface AssignmentHistoryRow {
  id: string;
  hallName: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

interface CaregiverLoadState {
  data: () => CaregiverMotherResponse[];
  loadCaregivers: () => ReturnType<CaregiverAttendanceState['loadCaregivers']>;
}

@Component({
  standalone: true,
  selector: 'app-assignment-history-view',
  templateUrl: './assignment-history-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AssignmentHistoryViewComponent implements OnInit {
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);

  mode = input.required<AssignmentHistoryMode>();

  selectedCaregiverId = signal('');
  assignments = signal<CaregiverHallAssignment[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  readonly caregivers = computed(() => this.activeState().data());
  readonly activeCaregivers = computed(() =>
    this.caregivers().filter((caregiver) => caregiver.status === 'active'),
  );
  readonly halls = computed(() => this.activeHallState().communityHalls());
  readonly hallNameById = computed(() => {
    const map = new Map<string, string>();
    for (const hall of this.halls()) {
      map.set(hall.id, hall.name);
    }

    return map;
  });
  readonly rows = computed<AssignmentHistoryRow[]>(() => {
    const hallMap = this.hallNameById();

    return this.assignments().map((assignment, index) => {
      const isActive = assignment.validTo === null;

      return {
        id: assignment.id ?? `${assignment.caregiverId}-${assignment.communityHallId}-${assignment.validFrom}-${index}`,
        hallName: hallMap.get(assignment.communityHallId) ?? assignment.communityHallId,
        validFrom: this.formatDateOnly(assignment.validFrom),
        validTo: assignment.validTo ? this.formatDateOnly(assignment.validTo) : '-',
        isActive,
      };
    });
  });

  ngOnInit(): void {
    this.loadCaregivers();
    this.loadHalls();
  }

  onCaregiverChange(event: Event): void {
    const caregiverId = (event.target as HTMLSelectElement).value;
    this.selectedCaregiverId.set(caregiverId);
    this.assignments.set([]);
    this.error.set(null);

    if (!caregiverId) return;

    this.loadAssignments(caregiverId);
  }

  formatDateOnly(iso: string): string {
    return iso.split('T')[0];
  }

  statusBadgeCls(isActive: boolean): string {
    const base = 'inline-flex rounded-full px-2 py-1 text-xs font-medium ';
    return isActive
      ? base + 'bg-green-100 text-green-700'
      : base + 'bg-gray-100 text-gray-700';
  }

  private loadAssignments(caregiverId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.caregiverAttendanceService.getCaregiverAssignments(caregiverId).subscribe({
      next: (assignments) => {
        this.assignments.set(assignments);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.assignments.set([]);
        this.isLoading.set(false);
        this.error.set(err?.message ?? 'No se pudo cargar el historial de asignaciones.');
        console.error(err);
      },
    });
  }

  private loadCaregivers(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  private loadHalls(): void {
    const hallState = this.activeHallState();
    if (hallState.communityHalls().length === 0) {
      hallState.loadCommunityHalls().subscribe({ error: () => undefined });
    }
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
}
