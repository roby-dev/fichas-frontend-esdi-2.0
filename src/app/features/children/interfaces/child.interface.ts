export interface Child {
  id: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  admissionDate: Date;
  communityHallId: string;
  admissionValidFrom: Date;
  admissionValidUntil: Date;
  graduationDate: Date;
  isCurrentlyAdmitted: boolean;
  isGraduated: boolean;
}
