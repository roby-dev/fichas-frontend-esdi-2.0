import { inject, Injectable, signal } from '@angular/core';
import { Committee } from '../interfaces/committee.interface';
import { CommitteeMembership } from '../interfaces/committee-membership.interface';
import { COMMITTEE_CODE_KEY, COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';
import { CommitteesService } from '../services/committees.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommitteeState {
  private readonly committeeService = inject(CommitteesService);

  userCommittees = signal<CommitteeMembership[]>([]);
  adminCommittees = signal<Committee[]>([]);
  committee = signal<CommitteeMembership['committee'] | null>(null);

  setCommittee(committee: CommitteeMembership['committee']) {
    this.committee.set(committee);
    localStorage.setItem(COMMITTEE_ID_KEY, committee.id);
    localStorage.setItem(COMMITTEE_NAME_KEY, committee.name);
    localStorage.setItem(COMMITTEE_CODE_KEY, committee.committeeId);
  }

  clearCommittee() {
    this.committee.set(null);
    this.userCommittees.set([]);
    this.adminCommittees.set([]);
    localStorage.removeItem(COMMITTEE_ID_KEY);
    localStorage.removeItem(COMMITTEE_NAME_KEY);
    localStorage.removeItem(COMMITTEE_CODE_KEY);
  }

  loadCommittesByUser() {
    return this.committeeService.getCommitteesByUser().pipe(
      tap({
        next: (res) => {
          this.userCommittees.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }

  loadAllCommittes() {
    return this.committeeService.getCommittees().pipe(
      tap({
        next: (res) => {
          this.adminCommittees.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  }
}
