import { Injectable, signal } from '@angular/core';
import { Committee } from '../interfaces/committee.interface';
import { COMMITTEE_ID_KEY, COMMITTEE_NAME_KEY } from '@/core/constants/constants';

@Injectable({ providedIn: 'root' })
export class CommitteeState {
  committee = signal<Committee | null>(null);

  setCommittee(committee: Committee) {
    this.committee.set(committee);
    localStorage.setItem(COMMITTEE_ID_KEY, committee.id);
    localStorage.setItem(COMMITTEE_NAME_KEY, committee.name);
  }

  clearCommittee() {
    this.committee.set(null);
    localStorage.removeItem(COMMITTEE_ID_KEY);
    localStorage.removeItem(COMMITTEE_NAME_KEY);
  }
}
