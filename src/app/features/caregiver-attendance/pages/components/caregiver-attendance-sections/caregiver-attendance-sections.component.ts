import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CaregiverManagementComponent } from '../caregiver-management/caregiver-management.component';
import { ScheduleVersionListComponent } from '../schedule-version-list/schedule-version-list.component';
import { AssistedMarkFormComponent } from '../assisted-mark-form/assisted-mark-form.component';

type CaregiverAttendanceMode = 'admin' | 'user';
type CaregiverAttendanceSection = 'caregivers' | 'horarios' | 'asistencias';

@Component({
  standalone: true,
  selector: 'app-caregiver-attendance-sections',
  imports: [CaregiverManagementComponent, ScheduleVersionListComponent, AssistedMarkFormComponent],
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
