import { CaregiverMotherResponse } from './caregiver-mother.interface';
import { MarkResponse } from './caregiver-attendance-mark.interface';
import { ExceptionResponse } from './caregiver-attendance-exception.interface';
import { ScheduleVersionResponse } from './caregiver-schedule.interface';

type HasNoNativeDate<T> = Extract<NonNullable<T>, Date> extends never ? true : false;
type Assert<T extends true> = T;

type _CaregiverStartDateIsJsonSafe = Assert<HasNoNativeDate<CaregiverMotherResponse['startDate']>>;
type _CaregiverEndDateIsJsonSafe = Assert<HasNoNativeDate<CaregiverMotherResponse['endDate']>>;
type _ScheduleValidFromIsJsonSafe = Assert<HasNoNativeDate<ScheduleVersionResponse['validFrom']>>;
type _ScheduleValidToIsJsonSafe = Assert<HasNoNativeDate<ScheduleVersionResponse['validTo']>>;
type _MarkLocalDateIsJsonSafe = Assert<HasNoNativeDate<MarkResponse['localDate']>>;
type _ExceptionLocalDateIsJsonSafe = Assert<HasNoNativeDate<ExceptionResponse['localDate']>>;

describe('caregiver attendance DTO date contracts', () => {
  it('keeps caregiver response date fields as JSON-safe strings', () => {
    const response: CaregiverMotherResponse = {
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

    expect(response.startDate).toBe('2026-07-01');
    expect(typeof response.startDate).toBe('string');
    expect(response.endDate).toBeNull();
  });

  it('keeps schedule and mark date fields serializable without Date conversion', () => {
    const schedule: ScheduleVersionResponse = {
      id: 'schedule-1',
      communityHallId: 'hall-1',
      name: 'Morning schedule',
      validFrom: '2026-07-01',
      validTo: '2026-12-31',
      blocks: [],
      dayRules: [],
      specialDays: [{ localDate: '2026-07-28', isWorkingDay: false, blockIds: [] }],
    };
    const mark: MarkResponse = {
      id: 'mark-1',
      caregiverId: 'caregiver-1',
      communityHallId: 'hall-1',
      localDate: '2026-07-01',
      blockId: 'morning',
      markKind: 'entry',
      entryTime: '08:05',
      source: 'self_service',
      reason: null,
      isVoided: false,
    };

    expect(schedule.validFrom).toBe('2026-07-01');
    expect(schedule.validTo).toBe('2026-12-31');
    expect(schedule.specialDays[0].localDate).toBe('2026-07-28');
    expect(mark.localDate).toBe('2026-07-01');
    expect(typeof schedule.validFrom).toBe('string');
    expect(typeof mark.localDate).toBe('string');
  });
});
