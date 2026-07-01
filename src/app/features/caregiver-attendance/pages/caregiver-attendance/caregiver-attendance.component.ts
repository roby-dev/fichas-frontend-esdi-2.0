import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { AdminCaregiverAttendanceComponent } from '../components/admin-caregiver-attendance/admin-caregiver-attendance.component';
import { UserCaregiverAttendanceComponent } from '../components/user-caregiver-attendance/user-caregiver-attendance.component';

@Component({
  standalone: true,
  selector: 'app-caregiver-attendance',
  imports: [AdminCaregiverAttendanceComponent, UserCaregiverAttendanceComponent],
  templateUrl: './caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CaregiverAttendanceComponent {
  readonly authService = inject(AuthService);
}
