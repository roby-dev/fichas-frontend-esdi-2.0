import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Committee } from '../../../layouts/admin-layout/interfaces/committee.interface';
import { CreateCommitteeRequest } from '../interfaces/create-committee-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CommitteesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/management-committees`;

  createCommittee(request: CreateCommitteeRequest) {
    return this.http.post(`${this.baseUrl}`, request);
  }

  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>(`${this.baseUrl}`);
  }

  getCommitteeById(id: string): Observable<Committee> {
    return this.http.get<Committee>(`${this.baseUrl}/${id}`);
  }
}
