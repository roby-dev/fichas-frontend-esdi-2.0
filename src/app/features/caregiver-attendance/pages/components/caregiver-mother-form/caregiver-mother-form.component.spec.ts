import { TestBed } from '@angular/core/testing';
import { CaregiverMotherResponse } from '../../../interfaces/caregiver-mother.interface';
import { CaregiverMotherFormComponent } from './caregiver-mother-form.component';

describe('CaregiverMotherFormComponent', () => {
  const caregiver: CaregiverMotherResponse = {
    id: 'caregiver-1',
    documentType: 'DNI',
    documentNumber: '12345678',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    fullName: 'Maria Gonzalez',
    phone: '999111222',
    currentHallId: 'hall-1',
    currentHallName: 'Local Las Flores',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    status: 'retired',
  };
  const hall = { id: 'hall-1', name: 'Local Las Flores', localId: 'LC-1', committeeRef: 'committee-1', committee: {} } as never;

  function todayString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders registration controls without status or end date fields', async () => {
    await TestBed.configureTestingModule({ imports: [CaregiverMotherFormComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CaregiverMotherFormComponent);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const dateInputs = fixture.nativeElement.querySelectorAll('input[type="date"]');
    expect(dateInputs.length).toBe(1);
    expect((fixture.nativeElement.textContent ?? '')).toContain('Fecha de inicio');
    expect((fixture.nativeElement.textContent ?? '')).toContain('Local comunal');
    expect((fixture.nativeElement.textContent ?? '')).not.toContain('Fecha de fin');
    expect((fixture.nativeElement.textContent ?? '')).not.toContain('Estado');
  });

  it('defaults a new caregiver start date to today', async () => {
    await TestBed.configureTestingModule({ imports: [CaregiverMotherFormComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CaregiverMotherFormComponent);
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    expect(fixture.componentInstance.caregiverModel().startDate).toBe(todayString());
  });

  it('emits only registration fields for a new caregiver', async () => {
    await TestBed.configureTestingModule({ imports: [CaregiverMotherFormComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CaregiverMotherFormComponent);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('halls', [hall]);
    const saved = jasmine.createSpy('saved');
    fixture.componentInstance.saveCaregiverEvent.subscribe(saved);
    fixture.detectChanges();

    fixture.componentInstance.caregiverModel.set({
      documentType: 'DNI',
      documentNumber: '11112222',
      firstName: 'Ana',
      lastName: 'Torres',
      phone: '988776655',
      startDate: '2026-07-03',
      communityHallId: 'hall-1',
    });
    fixture.componentInstance.onSubmit(new Event('submit'));

    expect(saved).toHaveBeenCalledOnceWith({
      documentType: 'DNI',
      documentNumber: '11112222',
      firstName: 'Ana',
      lastName: 'Torres',
      phone: '988776655',
      startDate: '2026-07-03',
      communityHallId: 'hall-1',
    });
    expect(saved.calls.mostRecent().args[0].startDate instanceof Date).toBeFalse();
    expect(Object.prototype.hasOwnProperty.call(saved.calls.mostRecent().args[0], 'status')).toBeFalse();
    expect(Object.prototype.hasOwnProperty.call(saved.calls.mostRecent().args[0], 'endDate')).toBeFalse();
  });

  it('emits editable registration fields without status or end date for an existing caregiver', async () => {
    await TestBed.configureTestingModule({ imports: [CaregiverMotherFormComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CaregiverMotherFormComponent);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('caregiver', caregiver);
    const saved = jasmine.createSpy('saved');
    fixture.componentInstance.saveCaregiverEvent.subscribe(saved);
    fixture.detectChanges();

    expect((fixture.nativeElement.textContent ?? '')).not.toContain('Local comunal');
    fixture.componentInstance.onSubmit(new Event('submit'));

    expect(saved).toHaveBeenCalledOnceWith({
      documentType: 'DNI',
      documentNumber: '12345678',
      firstName: 'Maria',
      lastName: 'Gonzalez',
      phone: '999111222',
      startDate: '2026-07-01',
    });
    expect(Object.prototype.hasOwnProperty.call(saved.calls.mostRecent().args[0], 'status')).toBeFalse();
    expect(Object.prototype.hasOwnProperty.call(saved.calls.mostRecent().args[0], 'endDate')).toBeFalse();
  });
});
