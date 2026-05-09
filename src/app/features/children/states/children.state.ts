import { inject, Injectable, signal } from '@angular/core';
import { Child } from '../interfaces/child.interface';
import { ChildrenService } from '../services/children.service';
import { EMPTY, tap } from 'rxjs';
import { CommitteeState } from '@/features/committees/states/committee.state';

@Injectable({
  providedIn: 'root',
})
export class ChildrenState {
  private readonly childrenService = inject(ChildrenService);
  private readonly committeeState = inject(CommitteeState);

  children = signal<Child[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  loadChildren() {
    const committee = this.committeeState.committee();
    if (!committee?.id) {
      this.error.set('No hay un comité seleccionado');
      return EMPTY;
    }

    this.isLoading.set(true);
    this.error.set(null);
    return this.childrenService.getChildrenByCommittee(committee.id).pipe(
      tap({
        next: (res) => {
          this.children.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los niños');
          this.isLoading.set(false);
        },
      })
    );
  }

  clear() {
    this.children.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }
}
