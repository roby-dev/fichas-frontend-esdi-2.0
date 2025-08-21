import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommunityHall } from '../interfaces/community.interface';
import { CreateCommunityHallRequest } from '../interfaces/create-community-hall-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityHallsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/community-halls`;

  getCommunityHallsByCommitteeId(id: string): Observable<CommunityHall[]> {
    return this.http.get<CommunityHall[]>(`${this.baseUrl}/by-committee/${id}`);
  }

  createCommunityHall(request: CreateCommunityHallRequest): Observable<CommunityHall> {
    return this.http.post<CommunityHall>(this.baseUrl, request);
  }

  getCommunityHallById(id: string): Observable<CommunityHall> {
    return this.http.get<CommunityHall>(`${this.baseUrl}/${id}`);
  }
}
