import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AdminCommitteesService } from '../services/admin-committees.service';
import { AdminCommittee } from '../interfaces/admin-committee.interface';

@Injectable({ providedIn: 'root' })
export class AdminCommitteeState {
  private readonly adminCommitteeService = inject(AdminCommitteesService);
  committees = signal<AdminCommittee[]>([]);

  clearCommittee() {
    this.committees.set([]);
  }

  loadCommitteees() {
    return this.adminCommitteeService.getCommittees().pipe(
      tap({
        next: (res) => {
          this.committees.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
