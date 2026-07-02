import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CreateScheduleVersionRequest, ScheduleVersionResponse } from '../interfaces/caregiver-schedule.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';
import { CaregiverScheduleState } from './caregiver-schedule.state';

describe('CaregiverScheduleState', () => {
  const schedule: ScheduleVersionResponse = {
    id: 'schedule-1',
    communityHallId: 'hall-1',
    name: 'Horario regular',
    validFrom: '2026-07-01',
    validTo: null,
    blocks: [],
    dayRules: [],
    specialDays: [],
  };

  function setup(response = of([schedule])) {
    const service = {
      listSchedulesByHall: jasmine.createSpy('listSchedulesByHall').and.returnValue(response),
      createSchedule: jasmine.createSpy('createSchedule').and.returnValue(of(schedule)),
      copySchedule: jasmine.createSpy('copySchedule').and.returnValue(of(schedule)),
    };

    TestBed.configureTestingModule({
      providers: [CaregiverScheduleState, { provide: CaregiverAttendanceService, useValue: service }],
    });

    return { state: TestBed.inject(CaregiverScheduleState), service };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('loads schedules by hall and clears shell state', () => {
    const { state, service } = setup();

    state.loadByHall('hall-1').subscribe();

    expect(service.listSchedulesByHall).toHaveBeenCalledWith('hall-1');
    expect(state.versions()).toEqual([schedule]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBeNull();

    state.clear();

    expect(state.versions()).toEqual([]);
    expect(state.selectedHallId()).toBeNull();
    expect(state.error()).toBeNull();
  });

  it('aggregates schedules from multiple visible halls', () => {
    const { state, service } = setup();
    const secondSchedule = { ...schedule, id: 'schedule-2', communityHallId: 'hall-2' };
    service.listSchedulesByHall.and.callFake((hallId: string) => of(hallId === 'hall-1' ? [schedule] : [secondSchedule]));

    state.loadByHalls(['hall-1', 'hall-2']).subscribe();

    expect(service.listSchedulesByHall).toHaveBeenCalledWith('hall-1');
    expect(service.listSchedulesByHall).toHaveBeenCalledWith('hall-2');
    expect(state.versions()).toEqual([schedule, secondSchedule]);
    expect(state.selectedHallId()).toBeNull();
    expect(state.isLoading()).toBeFalse();
  });

  it('delegates create and copy to existing service seams', () => {
    const { state, service } = setup();
    const request: CreateScheduleVersionRequest = {
      communityHallId: 'hall-1',
      name: 'Horario nuevo',
      validFrom: '2026-07-01',
      blocks: [],
      dayRules: [],
    };

    state.create(request).subscribe();
    state.copy('schedule-1', { targetHallId: 'hall-2', validFrom: '2026-08-01', name: 'Copia' }).subscribe();

    expect(service.createSchedule).toHaveBeenCalledWith(request);
    expect(service.copySchedule).toHaveBeenCalledWith('schedule-1', {
      targetHallId: 'hall-2',
      validFrom: '2026-08-01',
      name: 'Copia',
    });
  });

  it('stores Spanish error text when schedule load fails', () => {
    const { state } = setup(throwError(() => new Error('No autorizado')));

    state.loadByHall('hall-1').subscribe({ error: () => undefined });

    expect(state.versions()).toEqual([]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBe('No autorizado');
  });
});
