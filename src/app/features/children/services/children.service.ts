import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateUpdateChildRequest } from '../interfaces/create-update-child-request.interface';
import { Observable } from 'rxjs';
import { Child } from '../interfaces/child.interface';

@Injectable({
  providedIn: 'root',
})
export class ChildrenService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/children`;

  createChild(request: CreateUpdateChildRequest): Observable<Child> {
    return this.http.post<Child>(this.baseUrl, request);
  }

  getChildren(limit: number = 10, offset: number = 0): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
  }

  updateChild(id: string, request: CreateUpdateChildRequest): Observable<Child> {
    return this.http.put<Child>(`${this.baseUrl}/${id}`, request);
  }

  deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
