import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ChildrenService } from '../services/children.service';
import { UserWithChildren } from '../interfaces/user-with-children.interface';

@Injectable({ providedIn: 'root' })
export class AdminChildrenState {
  private readonly childrenService = inject(ChildrenService);

  groupedByUser = signal<UserWithChildren[]>([]);

  clearGroupedByUser() {
    this.groupedByUser.set([]);
  }

  loadGroupedByUser() {
    return this.childrenService.getChildrenGroupedByUser().pipe(
      tap({
        next: (res) => {
          this.groupedByUser.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
