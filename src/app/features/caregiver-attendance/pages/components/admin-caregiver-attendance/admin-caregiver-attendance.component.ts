import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaregiverManagementComponent } from '../caregiver-management/caregiver-management.component';

@Component({
  standalone: true,
  selector: 'app-admin-caregiver-attendance',
  imports: [CaregiverManagementComponent],
  templateUrl: './admin-caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCaregiverAttendanceComponent {}
