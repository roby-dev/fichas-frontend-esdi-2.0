import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import {
  MonthlyHallReportResponse,
  MonthlyCommitteeReportResponse,
} from '../interfaces/caregiver-attendance-report.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';

@Injectable({ providedIn: 'root' })
export class CaregiverAttendanceReportState {
  private readonly service = inject(CaregiverAttendanceService);

  hallReport = signal<MonthlyHallReportResponse | null>(null);
  committeeReport = signal<MonthlyCommitteeReportResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadHallReport(hallId: string, year: number, month: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.getHallMonthlyReport(hallId, { year, month, includeExpectedWithoutMarks: true })
      .pipe(
        tap({
          next: (res) => {
            this.hallReport.set(res);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err?.message ?? 'Error al cargar el reporte');
            this.isLoading.set(false);
          },
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  loadCommitteeReport(committeeId: string, year: number, month: number): void {
    this.service.getCommitteeMonthlyReport(committeeId, { year, month })
      .pipe(
        tap({
          next: (res) => {
            this.committeeReport.set(res);
          },
          error: () => undefined,
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  clear(): void {
    this.hallReport.set(null);
    this.committeeReport.set(null);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
