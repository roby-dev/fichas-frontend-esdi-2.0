import { inject, Injectable, signal } from '@angular/core';
import { Committee } from '../interfaces/committee.interface';
import { CommitteeMembership } from '../interfaces/committee-membership.interface';
import { COMMITTEE_CODE_KEY, COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';
import { CommitteesService } from '../services/committees.service';
import { catchError, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommitteeState {
  private readonly committeeService = inject(CommitteesService);

  userCommittees = signal<CommitteeMembership[]>([]);
  adminCommittees = signal<Committee[]>([]);
  committee = signal<CommitteeMembership['committee'] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

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
    this.isLoading.set(false);
    this.error.set(null);
    localStorage.removeItem(COMMITTEE_ID_KEY);
    localStorage.removeItem(COMMITTEE_NAME_KEY);
    localStorage.removeItem(COMMITTEE_CODE_KEY);
  }

  loadCommittesByUser() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.committeeService.getCommitteesByUser().pipe(
      tap({
        next: (res) => {
          this.userCommittees.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los comités del usuario');
          this.isLoading.set(false);
        },
      })
    );
  }

  loadAllCommittes() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.committeeService.getCommittees().pipe(
      tap({
        next: (res) => {
          this.adminCommittees.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los comités');
          this.isLoading.set(false);
        },
      })
    );
  }
}
