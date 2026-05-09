import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ChildrenService } from '../services/children.service';
import { UserWithChildren } from '../interfaces/user-with-children.interface';

@Injectable({ providedIn: 'root' })
export class AdminChildrenState {
  private readonly childrenService = inject(ChildrenService);

  groupedByUser = signal<UserWithChildren[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  clear() {
    this.groupedByUser.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }

  loadGroupedByUser() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.childrenService.getChildrenGroupedByUser().pipe(
      tap({
        next: (res) => {
          this.groupedByUser.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los niños agrupados');
          this.isLoading.set(false);
        },
      })
    );
  }
}
