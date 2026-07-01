import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CaregiverManagementComponent } from '../caregiver-management/caregiver-management.component';

@Component({
  standalone: true,
  selector: 'app-user-caregiver-attendance',
  imports: [CaregiverManagementComponent],
  templateUrl: './user-caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCaregiverAttendanceComponent {}
