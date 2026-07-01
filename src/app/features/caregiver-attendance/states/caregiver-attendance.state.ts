import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { CaregiverMotherResponse } from '../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';

@Injectable({ providedIn: 'root' })
export class CaregiverAttendanceState {
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  data = signal<CaregiverMotherResponse[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadCaregivers() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.caregiverAttendanceService.listCaregivers().pipe(
      tap({
        next: (res) => {
          this.data.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar la asistencia de madres cuidadoras');
          this.isLoading.set(false);
        },
      })
    );
  }

  clear() {
    this.data.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
