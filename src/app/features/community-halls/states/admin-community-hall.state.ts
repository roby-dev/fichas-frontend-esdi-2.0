import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { CommunityHall } from '../interfaces/community.interface';
import { CommunityHallsService } from '../services/community-halls.service';

@Injectable({ providedIn: 'root' })
export class AdminCommunityHallState {
  private readonly communityHallService = inject(CommunityHallsService);

  communityHalls = signal<CommunityHall[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  clear() {
    this.communityHalls.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }

  loadCommunityHalls() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.communityHallService.getCommunityHalls().pipe(
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
}
