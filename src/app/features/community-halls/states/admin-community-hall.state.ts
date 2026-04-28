import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { CommunityHall } from '../interfaces/community.interface';
import { CommunityHallsService } from '../services/community-halls.service';

@Injectable({ providedIn: 'root' })
export class AdminCommunityHallState {
  private readonly communityHallService = inject(CommunityHallsService);
  communityHalls = signal<CommunityHall[]>([]);

  clearCommunityHalls() {
    this.communityHalls.set([]);
  }

  loadCommunityHalls() {
    return this.communityHallService.getCommunityHalls().pipe(
      tap({
        next: (res) => {
          this.communityHalls.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
