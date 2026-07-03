import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CaregiverAttendanceService } from '../../../services/caregiver-attendance.service';
import { CaregiverMotherResponse, TransferCaregiverMotherRequest } from '../../../interfaces/caregiver-mother.interface';
import { MarkResponse, CorrectMarkRequest } from '../../../interfaces/caregiver-attendance-mark.interface';
import { AdminCaregiverAttendanceState } from '../../../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../../../states/caregiver-attendance.state';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { ModalComponent } from '@/features/shared/components/modal/modal.component';
import { catchError, of, switchMap } from 'rxjs';

type CorrectionMode = 'admin' | 'user';

@Component({
  standalone: true,
  selector: 'app-correction-view',
  imports: [ButtonComponent, ModalComponent],
  templateUrl: './correction-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorrectionViewComponent implements OnInit {
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);
  private readonly adminHallState = inject(AdminCommunityHallState);
  private readonly userHallState = inject(CommunityHallState);
  private readonly adminState = inject(AdminCaregiverAttendanceState);
  private readonly userState = inject(CaregiverAttendanceState);

  mode = input.required<CorrectionMode>();

  // Filters
  selectedCaregiverId = signal('');
  selectedDate = signal('');

  // Marks list
  marks = signal<MarkResponse[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Correction modal
  isCorrectionOpen = signal(false);
  correctionTarget = signal<MarkResponse | null>(null);
  correctionEntryTime = signal('');
  correctionReason = signal('');
  correctionSubmitted = signal(false);
  isSaving = signal(false);
  saveError = signal<string | null>(null);

  readonly halls = computed(() => this.activeHallState().communityHalls());
  readonly caregivers = computed(() => this.activeState().data());

  readonly activeMarks = computed(() =>
    this.marks().filter((m) => !m.isVoided),
  );

  markKindLabel(kind: string): string {
    switch (kind) {
      case 'official': return 'Oficial';
      case 'special': return 'Especial';
      case 'correction': return 'Corrección';
      default: return kind;
    }
  }

  ngOnInit(): void {
    this.loadHallsAndCaregivers();
  }

  onCaregiverChange(event: Event): void {
    this.selectedCaregiverId.set((event.target as HTMLSelectElement).value);
    this.loadMarks();
  }

  onDateChange(event: Event): void {
    this.selectedDate.set((event.target as HTMLInputElement).value);
    this.loadMarks();
  }

  loadMarks(): void {
    const caregiverId = this.selectedCaregiverId();
    if (!caregiverId) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.caregiverAttendanceService.listMarksByCaregiver(caregiverId, this.selectedDate() || undefined)
      .pipe(catchError((err) => {
        this.error.set(err?.message ?? 'Error al cargar marcaciones');
        this.isLoading.set(false);
        return of([]);
      }))
      .subscribe((res) => {
        this.marks.set(res);
        this.isLoading.set(false);
      });
  }

  openCorrection(mark: MarkResponse): void {
    this.correctionTarget.set(mark);
    this.correctionEntryTime.set(mark.entryTime ?? '');
    this.correctionReason.set('');
    this.correctionSubmitted.set(false);
    this.saveError.set(null);
    this.isCorrectionOpen.set(true);
  }

  closeCorrection(): void {
    this.isCorrectionOpen.set(false);
    this.correctionTarget.set(null);
    this.saveError.set(null);
  }

  onSubmitCorrection(): void {
    this.correctionSubmitted.set(true);
    const target = this.correctionTarget();
    const reason = this.correctionReason().trim();
    if (!target || !reason) return;

    const request: CorrectMarkRequest = {
      entryTime: this.correctionEntryTime(),
      reason,
    };

    this.isSaving.set(true);
    this.saveError.set(null);

    this.caregiverAttendanceService.correctMark(target.id, request)
      .pipe(switchMap(() => {
        this.isSaving.set(false);
        this.closeCorrection();
        return this.caregiverAttendanceService.listMarksByCaregiver(
          this.selectedCaregiverId(),
          this.selectedDate() || undefined,
        );
      }))
      .subscribe({
        next: (marks) => {
          this.marks.set(marks);
        },
        error: (err) => {
          this.isSaving.set(false);
          this.saveError.set(err?.message ?? 'Error al corregir la marcación');
        },
      });
  }

  private loadHallsAndCaregivers(): void {
    this.activeState().loadCaregivers().subscribe({ error: () => undefined });
  }

  private activeState(): {
    data: () => CaregiverMotherResponse[];
    loadCaregivers: () => import('rxjs').Observable<CaregiverMotherResponse[]>;
  } {
    return this.mode() === 'admin' ? this.adminState : this.userState;
  }

  private activeHallState(): {
    communityHalls: () => CommunityHall[];
    loadCommunityHalls: () => import('rxjs').Observable<CommunityHall[]>;
  } {
    return this.mode() === 'admin' ? this.adminHallState : this.userHallState;
  }
}
