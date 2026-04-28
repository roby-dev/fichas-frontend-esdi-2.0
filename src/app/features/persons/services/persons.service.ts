import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreatePersonRequest } from '../interfaces/create-person-request.interface';
import { Person } from '../interfaces/person.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/persons`;

  createPerson(request: CreatePersonRequest): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, request);
  }

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }
}
