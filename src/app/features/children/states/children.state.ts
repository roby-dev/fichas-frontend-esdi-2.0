import { inject, Injectable, signal } from '@angular/core';
import { Child } from '../interfaces/child.interface';
import { ChildrenService } from '../services/children.service';
import { tap } from 'rxjs';
import { CommitteeState } from '@/features/committees/states/committee.state';

@Injectable({
  providedIn: 'root',
})
export class ChildrenState {
  private readonly childrenService = inject(ChildrenService);
  private readonly committeeState = inject(CommitteeState);

  children = signal<Child[]>([]);

  loadChildren() {
    return this.childrenService.getChildrenByCommittee(this.committeeState.committee()!.id).pipe(
      tap({
        next: (res) => {
          this.setChildren(res);
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }

  setChildren(children: Child[]): void {
    this.children.set(children);
  }

  clearChildren() {
    this.children.set([]);
  }
}
