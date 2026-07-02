import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, map, of, tap } from 'rxjs';
import {
  CopyScheduleVersionRequest,
  CreateScheduleVersionRequest,
  ScheduleVersionResponse,
} from '../interfaces/caregiver-schedule.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';

@Injectable({ providedIn: 'root' })
export class CaregiverScheduleState {
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  versions = signal<ScheduleVersionResponse[]>([]);
  selectedHallId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  loadByHall(hallId: string) {
    this.selectedHallId.set(hallId);
    this.isLoading.set(true);
    this.error.set(null);

    return this.caregiverAttendanceService.listSchedulesByHall(hallId).pipe(
      tap({
        next: (res) => {
          this.versions.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los horarios.');
          this.isLoading.set(false);
        },
      })
    );
  }

  loadByHalls(hallIds: string[]) {
    this.selectedHallId.set(null);
    this.isLoading.set(true);
    this.error.set(null);

    if (hallIds.length === 0) {
      this.versions.set([]);
      this.isLoading.set(false);
      return of([]);
    }

    return forkJoin(hallIds.map((hallId) => this.caregiverAttendanceService.listSchedulesByHall(hallId))).pipe(
      map((groups) => groups.flat()),
      tap({
        next: (res) => {
          this.versions.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los horarios.');
          this.isLoading.set(false);
        },
      })
    );
  }

  create(request: CreateScheduleVersionRequest) {
    this.isSaving.set(true);
    this.error.set(null);

    return this.caregiverAttendanceService.createSchedule(request).pipe(
      tap({
        next: () => this.isSaving.set(false),
        error: (err) => {
          this.error.set(err?.message ?? 'No se pudo guardar el horario.');
          this.isSaving.set(false);
        },
      })
    );
  }

  copy(scheduleId: string, request: CopyScheduleVersionRequest) {
    this.isSaving.set(true);
    this.error.set(null);

    return this.caregiverAttendanceService.copySchedule(scheduleId, request).pipe(
      tap({
        next: () => this.isSaving.set(false),
        error: (err) => {
          this.error.set(err?.message ?? 'No se pudo copiar el horario.');
          this.isSaving.set(false);
        },
      })
    );
  }

  clear() {
    this.versions.set([]);
    this.selectedHallId.set(null);
    this.isLoading.set(false);
    this.isSaving.set(false);
    this.error.set(null);
  }
}
