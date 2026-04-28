import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { AdminCommunityHallsComponent } from '../components/admin-community-halls/admin-community-halls.component';
import { UserCommunityHallsComponent } from '../components/user-community-halls/user-community-halls.component';

@Component({
  standalone: true,
  selector: 'app-community-halls',
  imports: [AdminCommunityHallsComponent, UserCommunityHallsComponent],
  templateUrl: './community-halls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunityHallsComponent {
  readonly authService = inject(AuthService);
}
