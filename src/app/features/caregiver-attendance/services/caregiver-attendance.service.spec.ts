import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { CaregiverAttendanceService } from './caregiver-attendance.service';

describe('CaregiverAttendanceService', () => {
  let service: CaregiverAttendanceService;
  let http: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/api/v1/caregiver-attendance`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CaregiverAttendanceService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('uses the caregiver collection endpoints without converting date strings', () => {
    const createBody = {
      documentNumber: '12345678',
      firstName: 'Maria',
      lastName: 'Gonzalez',
      startDate: '2026-07-01',
    };
    const updateBody = { endDate: '2026-12-31', status: 'retired' as const };
    const transferBody = { communityHallId: 'hall-2', validFrom: '2026-08-01' };

    service.listCaregivers({ limit: 20, offset: 10 }).subscribe();
    let req = http.expectOne(`${baseUrl}/caregivers?limit=20&offset=10`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.createCaregiver(createBody).subscribe();
    req = http.expectOne(`${baseUrl}/caregivers`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createBody);
    expect(typeof req.request.body.startDate).toBe('string');
    req.flush({});

    service.getCaregiver('caregiver-1').subscribe();
    req = http.expectOne(`${baseUrl}/caregivers/caregiver-1`);
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.updateCaregiver('caregiver-1', updateBody).subscribe();
    req = http.expectOne(`${baseUrl}/caregivers/caregiver-1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateBody);
    expect(typeof req.request.body.endDate).toBe('string');
    req.flush({});

    service.transferCaregiver('caregiver-1', transferBody).subscribe();
    req = http.expectOne(`${baseUrl}/caregivers/caregiver-1/transfers`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(transferBody);
    req.flush(null);

    service.getCaregiverAssignments('caregiver-1').subscribe();
    req = http.expectOne(`${baseUrl}/caregivers/caregiver-1/assignments`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('uses the schedule endpoints as thin HTTP calls', () => {
    const scheduleBody = {
      communityHallId: 'hall-1',
      name: 'Morning',
      validFrom: '2026-07-01',
      blocks: [],
      dayRules: [],
    };
    const copyBody = { targetHallId: 'hall-2', validFrom: '2026-08-01', name: 'Copied' };

    service.createSchedule(scheduleBody).subscribe();
    let req = http.expectOne(`${baseUrl}/schedules`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(scheduleBody);
    req.flush({});

    service.getSchedule('schedule-1').subscribe();
    req = http.expectOne(`${baseUrl}/schedules/schedule-1`);
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.listSchedulesByHall('hall-1').subscribe();
    req = http.expectOne(`${baseUrl}/schedules/hall/hall-1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    service.copySchedule('schedule-1', copyBody).subscribe();
    req = http.expectOne(`${baseUrl}/schedules/schedule-1/copy`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(copyBody);
    req.flush({});
  });

  it('uses mark and exception endpoints with original request bodies', () => {
    service.selfServiceMark({ documentNumber: '12345678', localDate: '2026-07-01', entryTime: '08:01' }).subscribe();
    let req = http.expectOne(`${baseUrl}/marks/self-service`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.localDate).toBe('2026-07-01');
    req.flush({});

    service.assistedMark({ caregiverId: 'caregiver-1', localDate: '2026-07-01', blockId: 'morning', reason: 'Registro asistido' }).subscribe();
    req = http.expectOne(`${baseUrl}/marks/assisted`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.localDate).toBe('2026-07-01');
    req.flush({});

    service.correctMark('mark-1', { entryTime: '08:10', reason: 'Corrección' }).subscribe();
    req = http.expectOne(`${baseUrl}/marks/mark-1/correction`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ entryTime: '08:10', reason: 'Corrección' });
    req.flush({});

    service.createException({ scope: 'hall', communityHallId: 'hall-1', localDate: '2026-07-28', kind: 'holiday', reason: 'Feriado' }).subscribe();
    req = http.expectOne(`${baseUrl}/exceptions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.localDate).toBe('2026-07-28');
    req.flush({});

    service.listHallExceptions('hall-1', '2026-07-28').subscribe();
    req = http.expectOne(`${baseUrl}/exceptions/hall/hall-1?localDate=2026-07-28`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('uses monthly report endpoints with query parameters', () => {
    service.getHallMonthlyReport('hall-1', { year: 2026, month: 7, includeExpectedWithoutMarks: true }).subscribe();
    let req = http.expectOne(`${baseUrl}/reports/halls/hall-1/monthly?year=2026&month=7&includeExpectedWithoutMarks=true`);
    expect(req.request.method).toBe('GET');
    req.flush({});

    service.getCommitteeMonthlyReport('committee-1', { year: 2026, month: 7 }).subscribe();
    req = http.expectOne(`${baseUrl}/reports/committees/committee-1/monthly?year=2026&month=7`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
