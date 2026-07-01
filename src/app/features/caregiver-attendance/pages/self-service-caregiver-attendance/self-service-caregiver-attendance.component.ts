import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-self-service-caregiver-attendance',
  imports: [],
  templateUrl: './self-service-caregiver-attendance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SelfServiceCaregiverAttendanceComponent {}
