import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BulkUpdateRequest } from '../interfaces/bulk-update-request.interface';
import { Observable } from 'rxjs';
import { BulkUpdateResponse } from '../interfaces/bulk-update-response.interface';
import { AlertSignalChild } from '../interfaces/alert-signal-child.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertSignalsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/alert-child`;

  bulkUpdate(request: BulkUpdateRequest): Observable<HttpEvent<BulkUpdateResponse>> {
    const fd = new FormData();
    fd.append('file', request.file);
    fd.append('committeeId', request.committeeId);

    return this.http.post<BulkUpdateResponse>(`${this.baseUrl}/bulk-update`, fd, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getAlertSignals(): Observable<AlertSignalChild[]> {
    return this.http.get<AlertSignalChild[]>(this.baseUrl);
  }

  getAlertSignalsByCommittee(id: string): Observable<AlertSignalChild[]> {
    return this.http.get<AlertSignalChild[]>(`${this.baseUrl}/by-committee/${id}`);
  }
}
