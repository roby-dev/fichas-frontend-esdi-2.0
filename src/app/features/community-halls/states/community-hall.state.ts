import { inject, Injectable, signal } from '@angular/core';
import { CommunityHall } from '../interfaces/community.interface';
import { CommitteeState } from '@/features/committees/states/committee.state';
import { CommunityHallsService } from '../services/community-halls.service';
import { EMPTY, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunityHallState {
  private readonly communityHallService = inject(CommunityHallsService);
  private readonly committeeState = inject(CommitteeState);

  communityHalls = signal<CommunityHall[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadCommunityHalls() {
    const committee = this.committeeState.committee();
    if (!committee?.id) {
      this.error.set('No hay un comité seleccionado');
      return EMPTY;
    }

    this.isLoading.set(true);
    this.error.set(null);
    return this.communityHallService
      .getCommunityHallsByCommitteeId(committee.id)
      .pipe(
        tap({
          next: (res) => {
            this.communityHalls.set(res);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set(err?.message ?? 'Error al cargar los locales comunales');
            this.isLoading.set(false);
          },
        })
      );
  }

  clear() {
    this.communityHalls.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
