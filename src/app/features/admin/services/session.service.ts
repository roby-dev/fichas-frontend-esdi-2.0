import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionPageResponse } from '../interfaces/session-page-response.interface';
import { SessionSummaryPageResponse } from '../interfaces/session-summary-page-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/admin/sessions`;

  getSessions(
    params?: {
      userId?: string;
      active?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Observable<SessionPageResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<SessionPageResponse>(this.baseUrl, { params: httpParams });
  }

  getSessionsSummary(
    params?: {
      limit?: number;
      offset?: number;
    }
  ): Observable<SessionSummaryPageResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<SessionSummaryPageResponse>(`${this.baseUrl}/summary`, { params: httpParams });
  }
}
