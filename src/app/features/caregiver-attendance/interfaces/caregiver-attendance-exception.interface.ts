export type CaregiverAttendanceExceptionScope = 'hall' | 'caregiver';
export type CaregiverAttendanceExceptionKind = 'holiday' | 'day_off' | 'permission' | 'justification';
export type CaregiverAttendanceExceptionStatus = 'accepted' | 'pending';

export interface CreateExceptionRequest {
  scope: CaregiverAttendanceExceptionScope;
  communityHallId?: string;
  caregiverId?: string;
  localDate: string;
  blockId?: string;
  kind: CaregiverAttendanceExceptionKind;
  status?: CaregiverAttendanceExceptionStatus;
  reason: string;
}

export interface ExceptionResponse {
  id: string;
  scope: CaregiverAttendanceExceptionScope;
  communityHallId: string | null;
  caregiverId: string | null;
  localDate: string;
  blockId: string | null;
  kind: CaregiverAttendanceExceptionKind;
  status: CaregiverAttendanceExceptionStatus;
  reason: string;
}
