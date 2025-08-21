export interface AlertSignalChild {
  id: string;
  documentNumber: string;
  fullName: string;
  gender: string;
  childCode: string;
  admissionDate: Date;
  birthday: Date;
  managementCommitteName: string;
  communityHallName: string;
  managementCommitteCode: string;
  communityHallId: string;
  userId: string;
  ageInMonths: number;
  activeAlertSignal: string;
  alertSignalSchedule: string;
}
