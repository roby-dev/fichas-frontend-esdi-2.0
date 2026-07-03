import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { ExceptionResponse, CreateExceptionRequest } from '../interfaces/caregiver-attendance-exception.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';

@Injectable({ providedIn: 'root' })
export class CaregiverAttendanceExceptionState {
  private readonly service = inject(CaregiverAttendanceService);

  exceptions = signal<ExceptionResponse[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  saveError = signal<string | null>(null);

  loadHallExceptions(hallId: string, localDate: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.service.listHallExceptions(hallId, localDate)
      .pipe(
        tap({
          next: (res) => {
            this.exceptions.set(res);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err?.message ?? 'Error al cargar excepciones');
            this.isLoading.set(false);
          },
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  createException(request: CreateExceptionRequest): void {
    this.isSaving.set(true);
    this.saveError.set(null);

    this.service.createException(request)
      .pipe(
        tap({
          next: () => {
            this.isSaving.set(false);
          },
          error: (err) => {
            this.isSaving.set(false);
            this.saveError.set(err?.message ?? 'Error al crear excepción');
          },
        }),
        catchError(() => of(null)),
      )
      .subscribe();
  }

  clear(): void {
    this.exceptions.set([]);
    this.isLoading.set(false);
    this.isSaving.set(false);
    this.error.set(null);
    this.saveError.set(null);
  }
}
