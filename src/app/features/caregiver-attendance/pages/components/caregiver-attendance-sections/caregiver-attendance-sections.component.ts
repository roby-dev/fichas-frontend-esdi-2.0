import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CaregiverManagementComponent } from '../caregiver-management/caregiver-management.component';
import { ScheduleVersionListComponent } from '../schedule-version-list/schedule-version-list.component';
import { AssistedMarkFormComponent } from '../assisted-mark-form/assisted-mark-form.component';
import { ReportViewComponent } from '../report-view/report-view.component';
import { ExceptionViewComponent } from '../exception-view/exception-view.component';
import { CorrectionViewComponent } from '../correction-view/correction-view.component';
import AssignmentHistoryViewComponent from '../assignment-history-view/assignment-history-view.component';

type CaregiverAttendanceMode = 'admin' | 'user';
type CaregiverAttendanceSection = 'caregivers' | 'historial' | 'horarios' | 'asistencias' | 'reportes' | 'excepciones' | 'correcciones';

@Component({
  standalone: true,
  selector: 'app-caregiver-attendance-sections',
  imports: [CaregiverManagementComponent, AssignmentHistoryViewComponent, ScheduleVersionListComponent, AssistedMarkFormComponent, ReportViewComponent, ExceptionViewComponent, CorrectionViewComponent],
  templateUrl: './caregiver-attendance-sections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaregiverAttendanceSectionsComponent {
  mode = input.required<CaregiverAttendanceMode>();
  activeSection = signal<CaregiverAttendanceSection>('caregivers');

  setSection(section: CaregiverAttendanceSection): void {
    this.activeSection.set(section);
  }
}
