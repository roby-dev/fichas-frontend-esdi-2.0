import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MarkResponse } from '../interfaces/caregiver-attendance-mark.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';
import { CaregiverMarkState } from './caregiver-mark.state';

describe('CaregiverMarkState', () => {
  const mark: MarkResponse = {
    id: 'mark-1',
    caregiverId: 'caregiver-1',
    communityHallId: 'hall-1',
    localDate: '2026-07-01',
    blockId: 'block-1',
    markKind: 'entry',
    entryTime: '08:05',
    source: 'self-service',
    reason: null,
    isVoided: false,
  };

  function setup(selfServiceResponse = of(mark)) {
    const service = {
      selfServiceMark: jasmine.createSpy('selfServiceMark').and.returnValue(selfServiceResponse),
      assistedMark: jasmine.createSpy('assistedMark').and.returnValue(of(mark)),
    };

    TestBed.configureTestingModule({
      providers: [CaregiverMarkState, { provide: CaregiverAttendanceService, useValue: service }],
    });

    return { state: TestBed.inject(CaregiverMarkState), service };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('delegates self-service marks and clears shell state', () => {
    const { state, service } = setup();

    state.selfService({ documentType: 'DNI', documentNumber: '12345678' }).subscribe();

    expect(service.selfServiceMark).toHaveBeenCalledWith({ documentType: 'DNI', documentNumber: '12345678' });
    expect(state.lastMark()).toEqual(mark);
    expect(state.isSubmitting()).toBeFalse();
    expect(state.error()).toBeNull();

    state.clear();

    expect(state.lastMark()).toBeNull();
    expect(state.error()).toBeNull();
  });

  it('delegates assisted marks with string date and time values', () => {
    const { state, service } = setup();

    state.assisted({
      caregiverId: 'caregiver-1',
      localDate: '2026-07-01',
      blockId: 'block-1',
      entryTime: '08:05',
      reason: 'Registro asistido',
    }).subscribe();

    expect(service.assistedMark).toHaveBeenCalledWith(jasmine.objectContaining({
      localDate: '2026-07-01',
      entryTime: '08:05',
    }));
    expect(state.lastMark()).toEqual(mark);
  });

  it('stores Spanish rejection text when mark submit fails', () => {
    const { state } = setup(throwError(() => new Error('Fuera de ventana de marcado')));

    state.selfService({ documentNumber: '12345678' }).subscribe({ error: () => undefined });

    expect(state.lastMark()).toBeNull();
    expect(state.isSubmitting()).toBeFalse();
    expect(state.error()).toBe('Fuera de ventana de marcado');
  });

  it('prefers backend rejection text over generic HTTP errors', () => {
    const { state } = setup(throwError(() => ({
      error: { message: 'La marcación fue rechazada por estar fuera del horario permitido.' },
      message: 'Http failure response for /marks/self-service',
    })));

    state.selfService({ documentNumber: '12345678' }).subscribe({ error: () => undefined });

    expect(state.error()).toBe('La marcación fue rechazada por estar fuera del horario permitido.');
  });
});
