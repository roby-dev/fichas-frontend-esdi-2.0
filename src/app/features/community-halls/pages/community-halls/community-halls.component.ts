import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommunityHallState } from '../../states/community-hall.state.ts';


@Component({
  standalone: true,
  selector: 'app-community-halls',
  imports: [],
  templateUrl: './community-halls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommunityHallsComponent {
  communityHallState = inject(CommunityHallState);
}
