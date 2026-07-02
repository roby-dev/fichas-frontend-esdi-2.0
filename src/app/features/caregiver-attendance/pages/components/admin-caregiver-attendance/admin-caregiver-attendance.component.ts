import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaregiverAttendanceSectionsComponent } from '../caregiver-attendance-sections/caregiver-attendance-sections.component';

@Component({
  standalone: true,
  selector: 'app-admin-caregiver-attendance',
  imports: [CaregiverAttendanceSectionsComponent],
  templateUrl: './admin-caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCaregiverAttendanceComponent {}
