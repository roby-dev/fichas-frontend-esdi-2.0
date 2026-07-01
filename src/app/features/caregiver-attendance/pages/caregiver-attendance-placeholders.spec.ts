import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import { of } from 'rxjs';
import { CaregiverMotherResponse } from '../interfaces/caregiver-mother.interface';
import { CaregiverAttendanceService } from '../services/caregiver-attendance.service';
import { AdminCaregiverAttendanceState } from '../states/admin-caregiver-attendance.state';
import { CaregiverAttendanceState } from '../states/caregiver-attendance.state';
import CaregiverAttendanceComponent from './caregiver-attendance/caregiver-attendance.component';
import { AdminCaregiverAttendanceComponent } from './components/admin-caregiver-attendance/admin-caregiver-attendance.component';
import { CaregiverManagementComponent } from './components/caregiver-management/caregiver-management.component';
import { UserCaregiverAttendanceComponent } from './components/user-caregiver-attendance/user-caregiver-attendance.component';
import SelfServiceCaregiverAttendanceComponent from './self-service-caregiver-attendance/self-service-caregiver-attendance.component';

describe('caregiver attendance management pages', () => {
  const maria: CaregiverMotherResponse = {
    id: 'caregiver-1',
    documentType: 'DNI',
    documentNumber: '12345678',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    fullName: 'Maria Gonzalez',
    phone: '999111222',
    startDate: '2026-07-01',
    endDate: null,
    status: 'active',
  };

  const rosa: CaregiverMotherResponse = {
    id: 'caregiver-2',
    documentType: 'DNI',
    documentNumber: '87654321',
    firstName: 'Rosa',
    lastName: 'Lopez',
    fullName: 'Rosa Lopez',
    phone: null,
    startDate: '2026-06-15',
    endDate: '2026-12-31',
    status: 'retired',
  };

  function textContent(element: HTMLElement): string {
    return (element.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  function stateDouble(caregivers: CaregiverMotherResponse[]) {
    return {
      data: signal(caregivers),
      isLoading: signal(false),
      error: signal<string | null>(null),
      loadCaregivers: jasmine.createSpy('loadCaregivers').and.returnValue(of(caregivers)),
      clear: jasmine.createSpy('clear'),
    };
  }

  function todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  async function setupManagement(mode: 'admin' | 'user', caregivers = [maria, rosa]) {
    const adminState = stateDouble(caregivers);
    const userState = stateDouble(caregivers);
    const service = {
      createCaregiver: jasmine.createSpy('createCaregiver').and.returnValue(of(maria)),
      updateCaregiver: jasmine.createSpy('updateCaregiver').and.returnValue(of(rosa)),
    };

    await TestBed.configureTestingModule({
      imports: [CaregiverManagementComponent],
      providers: [
        { provide: AdminCaregiverAttendanceState, useValue: adminState },
        { provide: CaregiverAttendanceState, useValue: userState },
        { provide: CaregiverAttendanceService, useValue: service },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaregiverManagementComponent);
    fixture.componentRef.setInput('mode', mode);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance, adminState, userState, service };
  }

  afterEach(() => {
    jasmine.clock().uninstall();
    TestBed.resetTestingModule();
  });

  it('renders the admin wrapper as the shared caregiver management surface', async () => {
    const adminState = stateDouble([maria]);
    const userState = stateDouble([]);
    await TestBed.configureTestingModule({
      imports: [AdminCaregiverAttendanceComponent],
      providers: [
        { provide: AdminCaregiverAttendanceState, useValue: adminState },
        { provide: CaregiverAttendanceState, useValue: userState },
        { provide: CaregiverAttendanceService, useValue: {} },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminCaregiverAttendanceComponent);
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Madres cuidadoras');
    expect(textContent(fixture.nativeElement)).toContain('Maria Gonzalez');
    expect(textContent(fixture.nativeElement)).not.toContain('siguiente iteración');
    expect(fixture.nativeElement.querySelector('section.rounded-2xl')).toBeNull();
    expect(adminState.loadCaregivers).toHaveBeenCalled();
  });

  it('renders the user or AT wrapper through the backend-scoped user seam', async () => {
    const adminState = stateDouble([]);
    const userState = stateDouble([rosa]);
    await TestBed.configureTestingModule({
      imports: [UserCaregiverAttendanceComponent],
      providers: [
        { provide: AdminCaregiverAttendanceState, useValue: adminState },
        { provide: CaregiverAttendanceState, useValue: userState },
        { provide: CaregiverAttendanceService, useValue: {} },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserCaregiverAttendanceComponent);
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Madres cuidadoras');
    expect(textContent(fixture.nativeElement)).toContain('Rosa Lopez');
    expect(textContent(fixture.nativeElement)).not.toContain('siguiente iteración');
    expect(userState.loadCaregivers).toHaveBeenCalled();
    expect(adminState.loadCaregivers).not.toHaveBeenCalled();
  });

  it('self-loads the selected state by mode without inventing client-side scope policy', async () => {
    const admin = await setupManagement('admin');

    expect(admin.adminState.loadCaregivers).toHaveBeenCalledTimes(1);
    expect(admin.userState.loadCaregivers).not.toHaveBeenCalled();
    expect(textContent(admin.fixture.nativeElement)).toContain('Maria Gonzalez');

    TestBed.resetTestingModule();
    const user = await setupManagement('user');

    expect(user.userState.loadCaregivers).toHaveBeenCalledTimes(1);
    expect(user.adminState.loadCaregivers).not.toHaveBeenCalled();
    expect(textContent(user.fixture.nativeElement)).toContain('Rosa Lopez');
  });

  it('renders table fields, filters by name or document, and shows a Spanish empty row', async () => {
    const { fixture } = await setupManagement('admin');

    expect(textContent(fixture.nativeElement)).toContain('Documento');
    expect(textContent(fixture.nativeElement)).toContain('Nombre completo');
    expect(textContent(fixture.nativeElement)).toContain('Teléfono');
    expect(textContent(fixture.nativeElement)).toContain('Inicio');
    expect(textContent(fixture.nativeElement)).toContain('Fin');
    expect(textContent(fixture.nativeElement)).toContain('Estado');
    expect(textContent(fixture.nativeElement)).toContain('Maria Gonzalez');
    expect(textContent(fixture.nativeElement)).toContain('Rosa Lopez');

    const search = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    search.value = '87654321';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).not.toContain('Maria Gonzalez');
    expect(textContent(fixture.nativeElement)).toContain('Rosa Lopez');

    search.value = 'sin coincidencias';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('No hay madres cuidadoras registradas.');
  });

  it('keeps assignment, transfer, schedule, mark, exception, and report actions absent', async () => {
    const { fixture } = await setupManagement('admin');
    const text = textContent(fixture.nativeElement).toLowerCase();

    expect(text).not.toContain('transferir');
    expect(text).not.toContain('asignación');
    expect(text).not.toContain('horario');
    expect(text).not.toContain('marcar');
    expect(text).not.toContain('excepción');
    expect(text).not.toContain('reporte');
  });

  it('shows Retirar only for active caregivers', async () => {
    const active = await setupManagement('admin', [maria]);
    expect(textContent(active.fixture.nativeElement)).toContain('Retirar');

    TestBed.resetTestingModule();
    const retired = await setupManagement('admin', [rosa]);
    expect(textContent(retired.fixture.nativeElement)).not.toContain('Retirar');
    expect(textContent(retired.fixture.nativeElement)).toContain('Retirada');
  });

  it('retires an active caregiver with a local date string and reloads the selected state', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 6, 5, 12, 0, 0));
    const { fixture, adminState, service } = await setupManagement('admin', [maria]);

    const retireButton = Array.from(fixture.nativeElement.querySelectorAll('button'))
      .find((button) => textContent(button as HTMLElement) === 'Retirar') as HTMLButtonElement | undefined;
    expect(retireButton).toBeDefined();

    retireButton!.click();
    fixture.detectChanges();

    expect(service.updateCaregiver).toHaveBeenCalledWith('caregiver-1', {
      status: 'retired',
      endDate: todayString(),
    });
    expect(adminState.loadCaregivers).toHaveBeenCalledTimes(2);
  });

  it('creates or edits through the service seam, reloads the selected state, and closes the modal', async () => {
    const { component, adminState, service } = await setupManagement('admin');

    component.openModal();
    component.onCaregiverSaved({
      documentType: 'DNI',
      documentNumber: '11112222',
      firstName: 'Ana',
      lastName: 'Torres',
      startDate: '2026-07-03',
    });

    expect(service.createCaregiver).toHaveBeenCalledWith(jasmine.objectContaining({ startDate: '2026-07-03' }));
    expect(adminState.loadCaregivers).toHaveBeenCalledTimes(2);
    expect(component.isModalOpen()).toBeFalse();

    component.openModal(rosa);
    component.onCaregiverSaved({ endDate: '2026-12-31', status: 'retired' });

    expect(service.updateCaregiver).toHaveBeenCalledWith('caregiver-2', jasmine.objectContaining({ endDate: '2026-12-31' }));
    expect(adminState.loadCaregivers).toHaveBeenCalledTimes(3);
    expect(component.isModalOpen()).toBeFalse();
  });

  it('renders the public self-service placeholder without authenticated workflow chrome', async () => {
    await TestBed.configureTestingModule({ imports: [SelfServiceCaregiverAttendanceComponent] }).compileComponents();

    const fixture = TestBed.createComponent(SelfServiceCaregiverAttendanceComponent);
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Auto registro de asistencia MC');
    expect(textContent(fixture.nativeElement)).toContain('Este acceso público queda preparado para el auto marcado.');
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeNull();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });

  it('renders the authenticated wrapper branch for admin users', async () => {
    await TestBed.configureTestingModule({
      imports: [CaregiverAttendanceComponent],
      providers: [{ provide: AuthService, useValue: { isAdmin: () => true } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(CaregiverAttendanceComponent);
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Madres cuidadoras');
    expect(textContent(fixture.nativeElement)).not.toContain('siguiente iteración');
  });
});
