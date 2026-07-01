export type CaregiverMotherStatus = 'active' | 'retired';

export interface CreateCaregiverMotherRequest {
  documentType?: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  startDate: string;
  endDate?: string;
  status?: CaregiverMotherStatus;
}

export interface UpdateCaregiverMotherRequest {
  documentType?: string;
  documentNumber?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  status?: CaregiverMotherStatus;
}

export interface TransferCaregiverMotherRequest {
  communityHallId: string;
  validFrom: string;
}

export interface CaregiverMotherResponse {
  id: string;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string | null;
  startDate: string;
  endDate: string | null;
  status: CaregiverMotherStatus;
}

export interface CaregiverHallAssignment {
  id?: string;
  caregiverId: string;
  communityHallId: string;
  validFrom: string;
  validTo?: string | null;
}
