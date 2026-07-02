import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminCommunityHallState } from '@/features/community-halls/states/admin-community-hall.state';
import { CommunityHallState } from '@/features/community-halls/states/community-hall.state';
import { CaregiverMotherResponse } from '../interfaces/caregiver-mother.interface';
import { ScheduleVersionResponse } from '../interfaces/caregiver-schedule.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from '../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../states/caregiver-attendance.state';
import { CaregiverMarkState } from '../states/caregiver-mark.state';
import { CaregiverScheduleState } from '../states/caregiver-schedule.state';
import { AssistedMarkFormComponent } from './components/assisted-mark-form/assisted-mark-form.component';
import { CaregiverAttendanceSectionsComponent } from './components/caregiver-attendance-sections/caregiver-attendance-sections.component';
import { CaregiverManagementComponent } from './components/caregiver-management/caregiver-management.component';
import { ScheduleCopyModalComponent } from './components/schedule-copy-modal/schedule-copy-modal.component';
import { ScheduleVersionFormComponent } from './components/schedule-version-form/schedule-version-form.component';
import { ScheduleVersionListComponent } from './components/schedule-version-list/schedule-version-list.component';
import SelfServiceCaregiverAttendanceComponent from './self-service-caregiver-attendance/self-service-caregiver-attendance.component';

describe('caregiver attendance schedules and marking', () => {
  const hall = { id: 'hall-1', name: 'Local Las Flores', localId: 'LC-1', committeeRef: 'committee-1', committee: {} } as never;
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
  const schedule: ScheduleVersionResponse = {
    id: 'schedule-1',
    communityHallId: 'hall-1',
    name: 'Horario mañana',
    validFrom: '2026-07-01',
    validTo: null,
    blocks: [{ id: 'block-1', name: 'Entrada', entryTime: '08:00', exitTime: null, exitRequired: false, toleranceMinutes: 10, markingWindowMinutes: 30 }],
    dayRules: [],
    specialDays: [],
  };

  function textContent(element: HTMLElement): string {
    return (element.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  function setupProviders() {
    const scheduleState = {
      versions: signal<ScheduleVersionResponse[]>([schedule]),
      selectedHallId: signal<string | null>(null),
      isLoading: signal(false),
      isSaving: signal(false),
      error: signal<string | null>(null),
      loadByHall: jasmine.createSpy('loadByHall').and.returnValue(of([schedule])),
      loadByHalls: jasmine.createSpy('loadByHalls').and.returnValue(of([schedule])),
      create: jasmine.createSpy('create').and.returnValue(of(schedule)),
      copy: jasmine.createSpy('copy').and.returnValue(of(schedule)),
      clear: jasmine.createSpy('clear'),
    };
    const markState = {
      lastMark: signal(null),
      isSubmitting: signal(false),
      error: signal<string | null>(null),
      selfService: jasmine.createSpy('selfService').and.returnValue(of({})),
      assisted: jasmine.createSpy('assisted').and.returnValue(of({})),
      clear: jasmine.createSpy('clear'),
    };
    const caregiverState = {
      data: signal([caregiver]),
      isLoading: signal(false),
      error: signal<string | null>(null),
      loadCaregivers: jasmine.createSpy('loadCaregivers').and.returnValue(of([caregiver])),
      clear: jasmine.createSpy('clear'),
    };
    const hallState = {
      communityHalls: signal([hall]),
      isLoading: signal(false),
      error: signal<string | null>(null),
      loadCommunityHalls: jasmine.createSpy('loadCommunityHalls').and.returnValue(of([hall])),
      clear: jasmine.createSpy('clear'),
    };
    const service = {
      getCaregiverAssignments: jasmine.createSpy('getCaregiverAssignments').and.returnValue(of([{ caregiverId: 'caregiver-1', communityHallId: 'hall-1', validFrom: '2026-07-01' }])),
      createCaregiver: jasmine.createSpy('createCaregiver').and.returnValue(of(caregiver)),
      updateCaregiver: jasmine.createSpy('updateCaregiver').and.returnValue(of(caregiver)),
      transferCaregiver: jasmine.createSpy('transferCaregiver').and.returnValue(of(undefined)),
    };

    return { scheduleState, markState, caregiverState, hallState, service };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('switches authenticated sections and renders only the active surface', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [CaregiverAttendanceSectionsComponent],
      providers: [
        { provide: CaregiverScheduleState, useValue: doubles.scheduleState },
        { provide: CaregiverMarkState, useValue: doubles.markState },
        { provide: AdminCaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: CaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: AdminCommunityHallState, useValue: doubles.hallState },
        { provide: CommunityHallState, useValue: doubles.hallState },
        { provide: CaregiverAttendanceService, useValue: doubles.service },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaregiverAttendanceSectionsComponent);
    fixture.componentRef.setInput('mode', 'admin');
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Madres cuidadoras');
    expect(textContent(fixture.nativeElement)).not.toContain('Horarios de atención');

    fixture.componentInstance.setSection('horarios');
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Horarios de atención');
    expect(textContent(fixture.nativeElement)).not.toContain('Registrar asistencia');
  });

  it('loads schedule versions for visible halls without an outside hall selector', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [ScheduleVersionListComponent],
      providers: [
        { provide: CaregiverScheduleState, useValue: doubles.scheduleState },
        { provide: AdminCommunityHallState, useValue: doubles.hallState },
        { provide: CommunityHallState, useValue: doubles.hallState },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ScheduleVersionListComponent);
    fixture.componentRef.setInput('mode', 'admin');
    fixture.detectChanges();

    expect(doubles.scheduleState.loadByHalls).toHaveBeenCalledWith(['hall-1']);
    expect(textContent(fixture.nativeElement)).toContain('Horario mañana');
    expect(textContent(fixture.nativeElement)).toContain('Local Las Flores');
    expect(textContent(fixture.nativeElement)).toContain('Nuevo horario');
    expect(textContent(fixture.nativeElement)).toContain('Copiar');
    expect(fixture.nativeElement.querySelector('select')).toBeNull();
    expect(textContent(fixture.nativeElement).toLowerCase()).not.toContain('corrección');
    expect(textContent(fixture.nativeElement).toLowerCase()).not.toContain('reporte');
  });

  it('builds a schedule request with string dates, string times, and matching block references', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [ScheduleVersionFormComponent],
      providers: [{ provide: CaregiverScheduleState, useValue: doubles.scheduleState }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ScheduleVersionFormComponent);
    fixture.componentRef.setInput('halls', [hall]);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.selectedHallId.set('hall-1');
    component.name.set('Horario regular');
    component.validFrom.set('2026-07-01');
    component.validTo.set('2026-12-31');
    component.blocks.set([{ id: 'block-1', name: 'Entrada', entryTime: '08:00', exitTime: '13:00', exitRequired: true, toleranceMinutes: 10, markingWindowMinutes: 30 }]);
    component.dayRules.set([{ dayOfWeek: 1, isWorkingDay: true, blockIds: ['block-1'] }]);
    component.specialDays.set([{ localDate: '2026-07-28', isWorkingDay: true, blockIds: ['block-1'] }]);

    const request = component.buildRequest();

    expect(textContent(fixture.nativeElement)).toContain('Local comunal');
    expect(request.communityHallId).toBe('hall-1');
    expect(request.validFrom).toBe('2026-07-01');
    expect(request.validTo).toBe('2026-12-31');
    expect(request.blocks[0].entryTime).toBe('08:00');
    expect(request.dayRules[0].blockIds).toEqual([request.blocks[0].id!]);
    expect(request.specialDays?.[0].blockIds).toEqual([request.blocks[0].id!]);
    expect(typeof request.validFrom).toBe('string');
  });

  it('submits caregiver local assignments through the transfer endpoint', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [CaregiverManagementComponent],
      providers: [
        { provide: AdminCaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: CaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: AdminCommunityHallState, useValue: doubles.hallState },
        { provide: CommunityHallState, useValue: doubles.hallState },
        { provide: CaregiverAttendanceService, useValue: doubles.service },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaregiverManagementComponent);
    fixture.componentRef.setInput('mode', 'admin');
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.openTransferModal(caregiver);
    component.transferModel.set({ communityHallId: 'hall-1', validFrom: '2026-07-03' });
    component.onTransferSubmit(new Event('submit'));

    expect(doubles.service.transferCaregiver).toHaveBeenCalledOnceWith('caregiver-1', {
      communityHallId: 'hall-1',
      validFrom: '2026-07-03',
    });
    expect(doubles.caregiverState.loadCaregivers).toHaveBeenCalled();
    expect(component.isTransferModalOpen()).toBeFalse();
  });

  it('emits a copy-to-hall request with string values', async () => {
    await TestBed.configureTestingModule({ imports: [ScheduleCopyModalComponent] }).compileComponents();

    const fixture = TestBed.createComponent(ScheduleCopyModalComponent);
    fixture.componentRef.setInput('halls', [hall]);
    fixture.detectChanges();
    const emitted: unknown[] = [];
    fixture.componentInstance.copy.subscribe((request) => emitted.push(request));
    fixture.componentInstance.targetHallId.set('hall-1');
    fixture.componentInstance.validFrom.set('2026-08-01');
    fixture.componentInstance.name.set('Horario copiado');

    fixture.componentInstance.onSubmit(new Event('submit'));

    expect(emitted[0]).toEqual({ targetHallId: 'hall-1', validFrom: '2026-08-01', name: 'Horario copiado' });
  });

  it('submits public self-service marks and shows Spanish feedback', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [SelfServiceCaregiverAttendanceComponent],
      providers: [{ provide: CaregiverMarkState, useValue: doubles.markState }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SelfServiceCaregiverAttendanceComponent);
    fixture.detectChanges();
    fixture.componentInstance.documentNumber.set('12345678');
    fixture.componentInstance.onSubmit(new Event('submit'));

    expect(doubles.markState.selfService).toHaveBeenCalledWith({ documentType: 'DNI', documentNumber: '12345678' });
    doubles.markState.error.set('Fuera de ventana de marcado');
    fixture.detectChanges();
    expect(textContent(fixture.nativeElement)).toContain('Fuera de ventana de marcado');
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeNull();
  });

  it('submits assisted marks from caregiver assignment schedules without a marks list', async () => {
    const doubles = setupProviders();
    await TestBed.configureTestingModule({
      imports: [AssistedMarkFormComponent],
      providers: [
        { provide: CaregiverScheduleState, useValue: doubles.scheduleState },
        { provide: CaregiverMarkState, useValue: doubles.markState },
        { provide: AdminCaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: CaregiverAttendanceState, useValue: doubles.caregiverState },
        { provide: CaregiverAttendanceService, useValue: doubles.service },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AssistedMarkFormComponent);
    fixture.componentRef.setInput('mode', 'admin');
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.onCaregiverChange('caregiver-1');
    component.localDate.set('2026-07-01');
    component.blockId.set('block-1');
    component.entryTime.set('08:05');
    component.reason.set('Documento registrado por AT');
    component.onSubmit(new Event('submit'));

    expect(doubles.service.getCaregiverAssignments).toHaveBeenCalledWith('caregiver-1');
    expect(doubles.scheduleState.loadByHall).toHaveBeenCalledWith('hall-1');
    expect(doubles.markState.assisted).toHaveBeenCalledWith(jasmine.objectContaining({ localDate: '2026-07-01', entryTime: '08:05' }));
    expect(textContent(fixture.nativeElement).toLowerCase()).not.toContain('corrección');
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });
});
