import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { AdminCommitteesService } from '../services/admin-committees.service';
import { AdminCommittee } from '../interfaces/admin-committee.interface';
import { CommitteeMembership } from '../interfaces/committee-membership.interface';

@Injectable({ providedIn: 'root' })
export class AdminCommitteeState {
  private readonly adminCommitteeService = inject(AdminCommitteesService);
  committees = signal<AdminCommittee[]>([]);
  committeeMemberships = signal<CommitteeMembership[]>([]);

  clearCommittee() {
    this.committees.set([]);
    this.committeeMemberships.set([]);
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

  loadCommitteeMemberships() {
    return this.adminCommitteeService.getCommitteeMemberships().pipe(
      tap({
        next: (res) => {
          this.committeeMemberships.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
