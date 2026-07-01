import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CaregiverHallAssignment,
  CaregiverMotherResponse,
  CreateCaregiverMotherRequest,
  TransferCaregiverMotherRequest,
  UpdateCaregiverMotherRequest,
} from '../interfaces/caregiver-mother.interface';
import {
  CopyScheduleVersionRequest,
  CreateScheduleVersionRequest,
  ScheduleVersionResponse,
} from '../interfaces/caregiver-schedule.interface';
import {
  AssistedMarkRequest,
  CorrectMarkRequest,
  MarkResponse,
  SelfServiceMarkRequest,
} from '../interfaces/caregiver-attendance-mark.interface';
import {
  CreateExceptionRequest,
  ExceptionResponse,
} from '../interfaces/caregiver-attendance-exception.interface';
import {
  MonthlyCommitteeReportResponse,
  MonthlyHallReportResponse,
  MonthlyReportQuery,
} from '../interfaces/caregiver-attendance-report.interface';

export interface CaregiverListQuery {
  limit?: number;
  offset?: number;
}

@Injectable({ providedIn: 'root' })
export class CaregiverAttendanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/caregiver-attendance`;

  listCaregivers(query: CaregiverListQuery = {}): Observable<CaregiverMotherResponse[]> {
    return this.http.get<CaregiverMotherResponse[]>(`${this.baseUrl}/caregivers`, { params: this.toParams(query) });
  }

  createCaregiver(request: CreateCaregiverMotherRequest): Observable<CaregiverMotherResponse> {
    return this.http.post<CaregiverMotherResponse>(`${this.baseUrl}/caregivers`, request);
  }

  getCaregiver(id: string): Observable<CaregiverMotherResponse> {
    return this.http.get<CaregiverMotherResponse>(`${this.baseUrl}/caregivers/${id}`);
  }

  updateCaregiver(id: string, request: UpdateCaregiverMotherRequest): Observable<CaregiverMotherResponse> {
    return this.http.patch<CaregiverMotherResponse>(`${this.baseUrl}/caregivers/${id}`, request);
  }

  transferCaregiver(id: string, request: TransferCaregiverMotherRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/caregivers/${id}/transfers`, request);
  }

  getCaregiverAssignments(id: string): Observable<CaregiverHallAssignment[]> {
    return this.http.get<CaregiverHallAssignment[]>(`${this.baseUrl}/caregivers/${id}/assignments`);
  }

  createSchedule(request: CreateScheduleVersionRequest): Observable<ScheduleVersionResponse> {
    return this.http.post<ScheduleVersionResponse>(`${this.baseUrl}/schedules`, request);
  }

  getSchedule(id: string): Observable<ScheduleVersionResponse> {
    return this.http.get<ScheduleVersionResponse>(`${this.baseUrl}/schedules/${id}`);
  }

  listSchedulesByHall(hallId: string): Observable<ScheduleVersionResponse[]> {
    return this.http.get<ScheduleVersionResponse[]>(`${this.baseUrl}/schedules/hall/${hallId}`);
  }

  copySchedule(id: string, request: CopyScheduleVersionRequest): Observable<ScheduleVersionResponse> {
    return this.http.post<ScheduleVersionResponse>(`${this.baseUrl}/schedules/${id}/copy`, request);
  }

  selfServiceMark(request: SelfServiceMarkRequest): Observable<MarkResponse> {
    return this.http.post<MarkResponse>(`${this.baseUrl}/marks/self-service`, request);
  }

  assistedMark(request: AssistedMarkRequest): Observable<MarkResponse> {
    return this.http.post<MarkResponse>(`${this.baseUrl}/marks/assisted`, request);
  }

  correctMark(id: string, request: CorrectMarkRequest): Observable<MarkResponse> {
    return this.http.patch<MarkResponse>(`${this.baseUrl}/marks/${id}/correction`, request);
  }

  createException(request: CreateExceptionRequest): Observable<ExceptionResponse> {
    return this.http.post<ExceptionResponse>(`${this.baseUrl}/exceptions`, request);
  }

  listHallExceptions(hallId: string, localDate: string): Observable<ExceptionResponse[]> {
    return this.http.get<ExceptionResponse[]>(`${this.baseUrl}/exceptions/hall/${hallId}`, { params: { localDate } });
  }

  getHallMonthlyReport(hallId: string, query: MonthlyReportQuery): Observable<MonthlyHallReportResponse> {
    return this.http.get<MonthlyHallReportResponse>(`${this.baseUrl}/reports/halls/${hallId}/monthly`, {
      params: this.toParams(query),
    });
  }

  getCommitteeMonthlyReport(committeeId: string, query: MonthlyReportQuery): Observable<MonthlyCommitteeReportResponse> {
    return this.http.get<MonthlyCommitteeReportResponse>(`${this.baseUrl}/reports/committees/${committeeId}/monthly`, {
      params: this.toParams(query),
    });
  }

  private toParams<T extends object>(query: T): HttpParams {
    return Object.entries(query).reduce((params, [key, value]) => {
      return value === undefined ? params : params.set(key, String(value));
    }, new HttpParams());
  }
}
