import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditPageResponse } from '../interfaces/audit-page-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/admin/audit`;

  getAuditEvents(
    params?: {
      actorUserId?: string;
      entityType?: string;
      entityId?: string;
      action?: string;
      from?: string;
      to?: string;
      limit?: number;
      offset?: number;
    }
  ): Observable<AuditPageResponse> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = (params as any)[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<AuditPageResponse>(this.baseUrl, { params: httpParams });
  }
}
