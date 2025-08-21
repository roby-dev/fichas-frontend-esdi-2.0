import { Committee } from '@/layouts/admin-layout/interfaces/committee.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommitteeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/management-committees`;

  getCommitteeById(id: string): Observable<Committee> {
    return this.http.get<Committee>(`${this.baseUrl}/${id}`);
  }
}
