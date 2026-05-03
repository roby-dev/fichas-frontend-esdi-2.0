import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Committee } from '../interfaces/committee.interface';
import { CommitteeMembership } from '../interfaces/committee-membership.interface';
import { CreateCommitteeRequest } from '../interfaces/create-committee-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CommitteesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/committees`;
  private readonly membershipsUrl = `${environment.apiUrl}/api/v1/committee-memberships`;

  createCommittee(request: CreateCommitteeRequest) {
    return this.http.post<Committee>(`${this.baseUrl}`, request);
  }

  getCommitteesByUser(): Observable<CommitteeMembership[]> {
    return this.http.get<CommitteeMembership[]>(`${this.membershipsUrl}/me`);
  }

  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>(`${this.baseUrl}`);
  }

  getCommitteeById(id: string): Observable<Committee> {
    return this.http.get<Committee>(`${this.baseUrl}/${id}`);
  }
}
