import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreateUpdateChildRequest } from '../interfaces/create-update-child-request.interface';
import { Observable } from 'rxjs';
import { Child } from '../interfaces/child.interface';
import { UserWithChildren } from '../interfaces/user-with-children.interface';

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

  getChildrenByUser(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}/by-user`);
  }

  getChildrenGroupedByUser(): Observable<UserWithChildren[]> {
    return this.http.get<UserWithChildren[]>(`${this.baseUrl}/grouped-by-user`);
  }

  getChildrenByCommittee(id: string): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}/by-committee/${id}`);
  }

  getChildById(id: string): Observable<Child> {
    return this.http.get<Child>(`${this.baseUrl}/${id}`);
  }

  updateChild(id: string, request: CreateUpdateChildRequest): Observable<Child> {
    return this.http.patch<Child>(`${this.baseUrl}/${id}`, request);
  }

  deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

