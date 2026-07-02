import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '@/features/shared/components/button/button.component';
import { MarkResponse } from '../../interfaces/caregiver-attendance-mark.interface';
import { CaregiverMarkState } from '../../states/caregiver-mark.state';

@Component({
  standalone: true,
  selector: 'app-self-service-caregiver-attendance',
  imports: [ButtonComponent],
  templateUrl: './self-service-caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SelfServiceCaregiverAttendanceComponent {
  readonly markState = inject(CaregiverMarkState);

  documentNumber = signal('');

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget instanceof HTMLFormElement ? event.currentTarget : null;
    const documentNumber = this.documentNumber().trim();
    if (!documentNumber || this.markState.isSubmitting()) return;

    this.markState.selfService({
      documentType: 'DNI',
      documentNumber,
    }).subscribe({
      next: () => {
        this.documentNumber.set('');
        form?.reset();
      },
      error: () => undefined,
    });
  }

  markSourceLabel(mark: MarkResponse): string {
    const sourceLabels: Record<string, string> = {
      'self-service': 'Auto registro',
      assisted: 'Registro asistido',
      correction: 'Corrección',
    };

    return sourceLabels[mark.source] ?? mark.source;
  }

  markKindLabel(mark: MarkResponse): string {
    const kindLabels: Record<string, string> = {
      entry: 'Ingreso',
      exit: 'Salida',
    };

    return kindLabels[mark.markKind] ?? mark.markKind;
  }
}
