import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Committee } from '../interfaces/committee.interface';
import { CreateCommitteeRequest } from '../interfaces/create-committee-request.interface';
import { AdminCommittee } from '../interfaces/admin-committee.interface';
import { AssignCommitteeRequest } from '../interfaces/assign-committee-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminCommitteesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/committees`;
  private readonly baseUrlCommittee = `${environment.apiUrl}/api/v1/management-committees`;

  createCommittee(request: CreateCommitteeRequest): Observable<AdminCommittee> {
    return this.http.post<AdminCommittee>(`${this.baseUrl}`, request);
  }

  createCommitteeForUser(request: AssignCommitteeRequest): Observable<AdminCommittee> {
    return this.http.post<AdminCommittee>(`${this.baseUrlCommittee}/for-user`, request);
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
}
