import { CommunityHall } from '@/features/community-halls/interfaces/community.interface';

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
  ageInMonths: number;
  isGraduated: boolean;
  communityHall: CommunityHall | undefined;
  admissionFormatted: string;
  graduationFormatted: string;
}
