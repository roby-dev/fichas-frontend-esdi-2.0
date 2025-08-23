import { ChildrenState } from '@/features/children/states/children.state';
import { CommunityHallState } from './../../../community-halls/states/community-hall.state.ts';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommitteesService } from '../../services/committees.service';
import { CommitteeState } from '../../states/committee.state.js';
import { Committee } from '@/layouts/admin-layout/interfaces/committee.interface';
import { forkJoin, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-committee',
  imports: [CommonModule],
  templateUrl: './committee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CommitteeComponent {
  private readonly committeeService = inject(CommitteesService);
  private readonly router = inject(Router);

  readonly committeeState = inject(CommitteeState);
  readonly communityHallState = inject(CommunityHallState);
  readonly childrenState = inject(ChildrenState);

  selectCommittee(committee: Committee) {
    this.committeeState.setCommittee(committee);
    forkJoin([this.communityHallState.loadCommunityHalls(), this.childrenState.loadChildren()]).subscribe();
    this.router.navigate(['/admin/dashboard']);
  }
}
