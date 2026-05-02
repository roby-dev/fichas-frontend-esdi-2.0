import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Committee } from '../interfaces/committee.interface';
import { CreateCommitteeRequest } from '../interfaces/create-committee-request.interface';
import { AdminCommittee } from '../interfaces/admin-committee.interface';
import { AssignCommitteeRequest } from '../interfaces/assign-committee-request.interface';
import { CommitteeMembership } from '../interfaces/committee-membership.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCommitteesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/committees`;
  private readonly baseUrlMemberships = `${environment.apiUrl}/api/v1/committee-memberships`;

  createCommittee(request: CreateCommitteeRequest): Observable<AdminCommittee> {
    return this.http.post<AdminCommittee>(`${this.baseUrl}`, request);
  }

  createCommitteeForUser(request: AssignCommitteeRequest): Observable<AdminCommittee> {
    return this.http.post<AdminCommittee>(`${this.baseUrlMemberships}`, request);
  }

  updateCommittee(id: string, request: CreateCommitteeRequest): Observable<AdminCommittee> {
    return this.http.patch<AdminCommittee>(`${this.baseUrl}/${id}`, request);
  }

  getCommittees(): Observable<AdminCommittee[]> {
    return this.http.get<Committee[]>(`${this.baseUrl}`);
  }

  getCommitteeById(id: string): Observable<AdminCommittee> {
    return this.http.get<AdminCommittee>(`${this.baseUrl}/${id}`);
  }

  getCommitteeMemberships(): Observable<CommitteeMembership[]> {
    return this.http.get<CommitteeMembership[]>(`${this.baseUrlMemberships}`);
  }
}
