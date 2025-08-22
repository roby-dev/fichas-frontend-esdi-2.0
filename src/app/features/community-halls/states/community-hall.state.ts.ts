import { inject, Injectable, signal } from '@angular/core';
import { CommunityHall } from '../interfaces/community.interface';
import { CommitteeState } from '@/layouts/admin-layout/states/committee.state';
import { CommunityHallsService } from '../services/community-halls.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityHallState {
  communityHalls = signal<CommunityHall[]>([]);
  private readonly communityHallService = inject(CommunityHallsService);
  private readonly committeeState = inject(CommitteeState);

  loadCommunityHalls() {
    return this.communityHallService
      .getCommunityHallsByCommitteeId(this.committeeState.committee()!.id)
      .pipe(
        tap({
          next: (res) => {
            this.setCommunityHalls(res);
          },
          error: (err) => {
            console.error(err);
          },
        })
      )
  }

  setCommunityHalls(communityHalls: CommunityHall[]) {
    this.communityHalls.set(communityHalls);
  }

  clearCommunityHalls() {
    this.communityHalls.set([]);
  }
}
