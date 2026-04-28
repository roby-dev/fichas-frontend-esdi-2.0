import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';

@Component({
  standalone: true,
  selector: 'app-user-community-halls',
  imports: [],
  templateUrl: './user-community-halls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCommunityHallsComponent {
  readonly communityHallState = inject(CommunityHallState);
}
