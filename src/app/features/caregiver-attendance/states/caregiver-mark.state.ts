import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AssistedMarkRequest, MarkResponse, SelfServiceMarkRequest } from '../interfaces/caregiver-attendance-mark.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';

@Injectable({ providedIn: 'root' })
export class CaregiverMarkState {
  private readonly caregiverAttendanceService = inject(CaregiverAttendanceService);

  lastMark = signal<MarkResponse | null>(null);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  selfService(request: SelfServiceMarkRequest) {
    this.isSubmitting.set(true);
    this.error.set(null);
    this.lastMark.set(null);

    return this.caregiverAttendanceService.selfServiceMark(request).pipe(
      tap({
        next: (res) => {
          this.lastMark.set(res);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.error.set(this.errorMessage(err, 'No se pudo registrar la asistencia.'));
          this.isSubmitting.set(false);
        },
      })
    );
  }

  assisted(request: AssistedMarkRequest) {
    this.isSubmitting.set(true);
    this.error.set(null);
    this.lastMark.set(null);

    return this.caregiverAttendanceService.assistedMark(request).pipe(
      tap({
        next: (res) => {
          this.lastMark.set(res);
          this.isSubmitting.set(false);
        },
        error: (err) => {
          this.error.set(this.errorMessage(err, 'No se pudo registrar el marcado asistido.'));
          this.isSubmitting.set(false);
        },
      })
    );
  }

  clear() {
    this.lastMark.set(null);
    this.isSubmitting.set(false);
    this.error.set(null);
  }

  private errorMessage(err: { error?: unknown; message?: string } | null | undefined, fallback: string): string {
    return this.backendMessage(err?.error) ?? err?.message ?? fallback;
  }

  private backendMessage(error: unknown): string | null {
    if (typeof error === 'string') return error;
    if (!error || typeof error !== 'object' || !('message' in error)) return null;

    const message = (error as { message?: unknown }).message;
    if (Array.isArray(message)) return message.filter((item): item is string => typeof item === 'string' && !!item.trim()).join('. ') || null;
    if (typeof message === 'string' && message.trim()) return message;

    return null;
  }
}
