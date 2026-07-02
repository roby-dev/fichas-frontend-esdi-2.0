import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MarkResponse } from '../../interfaces/caregiver-attendance-mark.interface';
import { CaregiverMarkState } from '../../states/caregiver-mark.state';
import SelfServiceCaregiverAttendanceComponent from './self-service-caregiver-attendance.component';

describe('SelfServiceCaregiverAttendanceComponent', () => {
  const mark: MarkResponse = {
    id: 'mark-1',
    caregiverId: 'caregiver-1',
    communityHallId: 'hall-1',
    localDate: '2026-07-02',
    blockId: 'block-1',
    markKind: 'entry',
    entryTime: '08:05',
    source: 'self-service',
    reason: null,
    isVoided: false,
  };

  async function setup() {
    const markState = {
      lastMark: signal<MarkResponse | null>(null),
      isSubmitting: signal(false),
      error: signal<string | null>(null),
      selfService: jasmine.createSpy('selfService'),
    };
    markState.selfService.and.callFake(() => {
      markState.lastMark.set(mark);
      return of(mark);
    });

    await TestBed.configureTestingModule({
      imports: [SelfServiceCaregiverAttendanceComponent],
      providers: [{ provide: CaregiverMarkState, useValue: markState }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SelfServiceCaregiverAttendanceComponent);
    fixture.detectChanges();

    return { fixture, markState };
  }

  function textContent(element: HTMLElement): string {
    return (element.textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  function enterDni(element: HTMLElement, documentNumber: string): void {
    const input = element.querySelector<HTMLInputElement>('#documentNumber')!;
    input.value = documentNumber;
    input.dispatchEvent(new Event('input'));
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders a public DNI-only marking form without authenticated layout chrome', async () => {
    const { fixture } = await setup();
    const element = fixture.nativeElement as HTMLElement;

    expect(textContent(element)).toContain('Marcación de asistencia');
    expect(textContent(element)).toContain('Marcar asistencia');
    expect(element.querySelectorAll('input, select, textarea').length).toBe(1);
    expect(element.querySelector('#documentNumber')).not.toBeNull();
    expect(element.querySelector('select')).toBeNull();
    expect(textContent(element)).not.toContain('Tipo de documento');
    expect(element.querySelector('router-outlet')).toBeNull();
    expect(element.querySelector('app-sidebar')).toBeNull();
    expect(element.querySelector('app-header')).toBeNull();
  });

  it('submits the visible DNI as an internal DNI self-service request and clears the input on success', async () => {
    const { fixture, markState } = await setup();
    const element = fixture.nativeElement as HTMLElement;

    enterDni(element, ' 12345678 ');
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(markState.selfService).toHaveBeenCalledTimes(1);
    expect(markState.selfService).toHaveBeenCalledWith({ documentType: 'DNI', documentNumber: '12345678' });
    expect(element.querySelector<HTMLInputElement>('#documentNumber')!.value).toBe('');
  });

  it('shows useful success details from the mark response', async () => {
    const { fixture, markState } = await setup();
    markState.lastMark.set(mark);

    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('Marcación registrada');
    expect(textContent(fixture.nativeElement)).toContain('Hora registrada: 08:05');
    expect(textContent(fixture.nativeElement)).toContain('Origen: Auto registro');
    expect(textContent(fixture.nativeElement)).toContain('Tipo de marcación: Ingreso');
  });

  it('shows backend rejection messages in Spanish', async () => {
    const { fixture, markState } = await setup();
    markState.selfService.and.callFake(() => {
      markState.error.set('La marcación fue rechazada por estar fuera del horario permitido.');
      return throwError(() => new Error('Rejected'));
    });

    enterDni(fixture.nativeElement, '12345678');
    fixture.nativeElement.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(textContent(fixture.nativeElement)).toContain('La marcación fue rechazada por estar fuera del horario permitido.');
  });

  it('does not submit twice while a mark is already being sent', async () => {
    const { fixture, markState } = await setup();
    markState.isSubmitting.set(true);
    enterDni(fixture.nativeElement, '12345678');

    fixture.nativeElement.querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(markState.selfService).not.toHaveBeenCalled();
  });
});
