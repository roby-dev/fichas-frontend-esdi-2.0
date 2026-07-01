export interface SelfServiceMarkRequest {
  documentType?: string;
  documentNumber: string;
  localDate?: string;
  entryTime?: string;
}

export interface AssistedMarkRequest {
  caregiverId: string;
  localDate: string;
  blockId: string;
  entryTime?: string;
  reason: string;
}

export interface CorrectMarkRequest {
  entryTime: string;
  reason: string;
}

export interface MarkResponse {
  id: string;
  caregiverId: string;
  communityHallId: string;
  localDate: string;
  blockId: string;
  markKind: string;
  entryTime: string | null;
  source: string;
  reason: string | null;
  isVoided: boolean;
}
