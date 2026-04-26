import { ChildrenState } from '@/features/children/states/children.state';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state.ts';
import { Committee } from '@/features/committees/interfaces/committee.interface';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, catchError, EMPTY } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-user-committees',
  imports: [NgClass],
  templateUrl: './user-committees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCommitteesComponent {
  private readonly router = inject(Router);

  readonly committeeState = inject(CommitteeState);
  readonly communityHallState = inject(CommunityHallState);
  readonly childrenState = inject(ChildrenState);

  selectCommittee(committee: Committee) {
    this.committeeState.setCommittee(committee);
    forkJoin([
      this.communityHallState.loadCommunityHalls(),
      this.childrenState.loadChildren(),
    ])
      .pipe(catchError(() => EMPTY))
      .subscribe();
    this.router.navigate(['/user/dashboard']);
  }
}
