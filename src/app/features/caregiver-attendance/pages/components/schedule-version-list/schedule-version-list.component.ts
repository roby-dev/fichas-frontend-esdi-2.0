import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CopyScheduleVersionRequest, ScheduleVersionResponse } from '../../../interfaces/caregiver-schedule.interface';
import { CaregiverScheduleState } from '../../../states/caregiver-schedule.state';
import { ScheduleCopyModalComponent } from '../schedule-copy-modal/schedule-copy-modal.component';
import { ScheduleVersionFormComponent } from '../schedule-version-form/schedule-version-form.component';

type ScheduleListMode = 'admin' | 'user';
const DAY_LABELS = ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'];

@Component({
  standalone: true,
  selector: 'app-schedule-version-list',
  imports: [ButtonComponent, ModalComponent, ScheduleVersionFormComponent, ScheduleCopyModalComponent],
  templateUrl: './schedule-version-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleVersionListComponent implements OnInit {
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  readonly scheduleState = inject(CaregiverScheduleState);

  mode = input.required<ScheduleListMode>();

  isFormOpen = signal(false);
  scheduleToCopy = signal<ScheduleVersionResponse | null>(null);

  halls = computed(() => this.mode() === 'admin' ? this.adminHallState.communityHalls() : this.userHallState.communityHalls());
  hallsAreLoading = computed(() => this.mode() === 'admin' ? this.adminHallState.isLoading() : this.userHallState.isLoading());
  versions = computed(() => this.scheduleState.versions());

  ngOnInit(): void {
    this.loadHalls();
  }

  openForm(): void {
    if (this.halls().length === 0) return;

    this.isFormOpen.set(true);
  }

  onScheduleSaved(): void {
    this.isFormOpen.set(false);
    this.refreshSchedules();
  }

  openCopy(schedule: ScheduleVersionResponse): void {
    this.scheduleToCopy.set(schedule);
  }

  closeCopy(): void {
    this.scheduleToCopy.set(null);
  }

  onCopy(request: CopyScheduleVersionRequest): void {
    const schedule = this.scheduleToCopy();
    if (!schedule) return;

    this.scheduleState.copy(schedule.id, request).pipe(switchMap(() => this.scheduleState.loadByHalls(this.hallIds()))).subscribe({
      next: () => this.closeCopy(),
      error: () => undefined,
    });
  }

  hallName(hallId: string): string {
    return this.halls().find((hall) => hall.id === hallId)?.name ?? hallId;
  }

  workingDayLabels(schedule: ScheduleVersionResponse): string[] {
    return schedule.dayRules
      .filter((rule) => rule.isWorkingDay)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      .map((rule) => DAY_LABELS[rule.dayOfWeek]);
  }

  private loadHalls(): void {
    const hallState = this.mode() === 'admin' ? this.adminHallState : this.userHallState;
    if (hallState.communityHalls().length > 0) {
      this.refreshSchedules();
      return;
    }

    hallState.loadCommunityHalls().subscribe({
      next: (halls: CommunityHall[]) => this.scheduleState.loadByHalls(halls.map((hall) => hall.id)).subscribe({ error: () => undefined }),
      error: () => undefined,
    });
  }

  private refreshSchedules(): void {
    this.scheduleState.loadByHalls(this.hallIds()).subscribe({ error: () => undefined });
  }

  private hallIds(): string[] {
    return this.halls().map((hall) => hall.id);
  }
}
