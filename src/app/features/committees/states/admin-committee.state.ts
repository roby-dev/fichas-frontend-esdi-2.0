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
  isLoading = signal(false);
  error = signal<string | null>(null);

  clear() {
    this.committees.set([]);
    this.committeeMemberships.set([]);
    this.isLoading.set(false);
    this.error.set(null);
  }

  loadCommitteees() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.adminCommitteeService.getCommittees().pipe(
      tap({
        next: (res) => {
          this.committees.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar los comités');
          this.isLoading.set(false);
        },
      })
    );
  }

  loadCommitteeMemberships() {
    this.isLoading.set(true);
    this.error.set(null);
    return this.adminCommitteeService.getCommitteeMemberships().pipe(
      tap({
        next: (res) => {
          this.committeeMemberships.set(res);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message ?? 'Error al cargar las membresías');
          this.isLoading.set(false);
        },
      })
    );
  }
}
