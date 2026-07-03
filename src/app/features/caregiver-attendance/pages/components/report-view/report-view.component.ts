import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CaregiverAttendanceReportState } from '../../../states/caregiver-attendance-report.state';
import { AuthService } from '@/core/services/auth.service';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { CaregiverMonthlySummary } from '../../../interfaces/caregiver-attendance-report.interface';

type ReportMode = 'admin' | 'user';

@Component({
  standalone: true,
  selector: 'app-report-view',
  imports: [ButtonComponent],
  templateUrl: './report-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportViewComponent implements OnInit {
  private readonly reportState = inject(CaregiverAttendanceReportState);
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  private readonly committeeState = inject(CommitteeState);
  readonly authService = inject(AuthService);

  mode = input.required<ReportMode>();

  selectedHallId = signal('');
  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth() + 1);

  expandedCaregiverId = signal<string | null>(null);

  readonly halls = computed(() => this.activeHallState().communityHalls());
  readonly hallReport = this.reportState.hallReport;
  readonly committeeReport = this.reportState.committeeReport;
  readonly isLoading = this.reportState.isLoading;
  readonly error = this.reportState.error;

  readonly committeeId = computed(() => this.committeeState.committee()?.id ?? '');

  readonly years = computed(() => {
    const current = new Date().getFullYear();
    return [current - 1, current, current + 1];
  });

  readonly months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ];

  readonly totalActive = computed(() =>
    this.hallReport()?.caregivers.filter((c) =>
      c.presentCount + c.tardyCount + c.specialCount + c.justifiedAbsenceCount + c.unjustifiedAbsenceCount > 0,
    ).length ?? 0,
  );

  ngOnInit(): void {
    this.loadHalls();
  }

  onHallChange(event: Event): void {
    this.selectedHallId.set((event.target as HTMLSelectElement).value);
    this.loadReport();
  }

  onYearChange(event: Event): void {
    this.selectedYear.set(Number((event.target as HTMLSelectElement).value));
    this.loadReport();
  }

  onMonthChange(event: Event): void {
    this.selectedMonth.set(Number((event.target as HTMLSelectElement).value));
    this.loadReport();
  }

  toggleExpand(caregiverId: string): void {
    this.expandedCaregiverId.set(
      this.expandedCaregiverId() === caregiverId ? null : caregiverId,
    );
  }

  outcomeLabel(outcome: string): string {
    switch (outcome) {
      case 'present': return 'Presente';
      case 'tardy': return 'Tardanza';
      case 'special': return 'Especial';
      case 'justified': return 'Justificado';
      case 'absent': return 'Falta';
      default: return outcome;
    }
  }

  outcomeCls(outcome: string): string {
    const base = 'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ';
    switch (outcome) {
      case 'present': return base + 'bg-green-100 text-green-700';
      case 'tardy': return base + 'bg-yellow-100 text-yellow-700';
      case 'special': return base + 'bg-blue-100 text-blue-700';
      case 'justified': return base + 'bg-purple-100 text-purple-700';
      case 'absent': return base + 'bg-red-100 text-red-700';
      default: return base + 'bg-gray-100 text-gray-700';
    }
  }

  private loadHalls(): void {
    const state = this.activeHallState();
    if (state.communityHalls().length === 0) {
      state.loadCommunityHalls().subscribe({ error: () => undefined });
    }
  }

  loadReport(): void {
    const hallId = this.selectedHallId();
    const year = this.selectedYear();
    const month = this.selectedMonth();
    if (!hallId) return;

    this.reportState.loadHallReport(hallId, year, month);

    if (this.authService.isAdmin() && this.committeeId()) {
      this.reportState.loadCommitteeReport(this.committeeId(), year, month);
    }
  }

  private activeHallState(): {
    communityHalls: () => CommunityHall[];
    loadCommunityHalls: () => import('rxjs').Observable<CommunityHall[]>;
  } {
    return this.mode() === 'admin' ? this.adminHallState : this.userHallState;
  }
}
