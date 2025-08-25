import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '@/core/services/auth.service.js';
import { UserCommitteesComponent } from '../components/user-committees/user-committees.component.js';
import { AdminCommitteesComponent } from '../components/admin-committees/admin-committees.component.js';

@Component({
  standalone: true,
  selector: 'app-committee',
  imports: [UserCommitteesComponent, AdminCommitteesComponent],
  templateUrl: './committee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommitteeComponent {
  readonly authService = inject(AuthService);
}
