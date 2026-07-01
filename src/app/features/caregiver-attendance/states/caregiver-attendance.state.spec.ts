import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CaregiverMotherResponse } from '../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from './admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from './caregiver-attendance.state';

describe('caregiver attendance state shells', () => {
  const caregiver: CaregiverMotherResponse = {
    id: 'caregiver-1',
    documentType: 'DNI',
    documentNumber: '12345678',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    fullName: 'Maria Gonzalez',
    phone: null,
    startDate: '2026-07-01',
    endDate: null,
    status: 'active',
  };

  function setup<T>(stateType: new (...args: never[]) => T, response = of([caregiver])): T {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        stateType,
        {
          provide: CaregiverAttendanceService,
          useValue: { listCaregivers: jasmine.createSpy('listCaregivers').and.returnValue(response) },
        },
      ],
    });

    return TestBed.inject(stateType);
  }

  it('loads admin caregivers and clears shell state', () => {
    const state = setup(AdminCaregiverAttendanceState);

    state.loadCaregivers().subscribe();

    expect(state.data()).toEqual([caregiver]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBeNull();

    state.clear();

    expect(state.data()).toEqual([]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBeNull();
  });

  it('loads user or AT caregivers through the same backend-scoped seam', () => {
    const state = setup(CaregiverAttendanceState);

    state.loadCaregivers().subscribe();

    expect(state.data()).toEqual([caregiver]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBeNull();
  });

  it('stores Spanish error text when a load fails', () => {
    const state = setup(CaregiverAttendanceState, throwError(() => new Error('Falla de red')));

    state.loadCaregivers().subscribe({ error: () => undefined });

    expect(state.data()).toEqual([]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBe('Falla de red');
  });

  it('uses a Spanish fallback error when the backend error has no message', () => {
    const state = setup(AdminCaregiverAttendanceState, throwError(() => ({})));

    state.loadCaregivers().subscribe({ error: () => undefined });

    expect(state.data()).toEqual([]);
    expect(state.isLoading()).toBeFalse();
    expect(state.error()).toBe('Error al cargar la asistencia de madres cuidadoras');
  });
});
