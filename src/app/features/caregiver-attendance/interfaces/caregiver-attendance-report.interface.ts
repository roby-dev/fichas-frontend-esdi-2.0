export interface MonthlyReportQuery {
  year: number;
  month: number;
  includeExpectedWithoutMarks?: boolean;
}

export interface BlockOutcome {
  localDate: string;
  blockId: string;
  blockName: string;
  outcome: 'present' | 'tardy' | 'special' | 'justified' | 'absent';
  entryTime: string | null;
  reason: string | null;
}

export interface CaregiverMonthlySummary {
  caregiverId: string;
  fullName: string;
  outcomes: BlockOutcome[];
  presentCount: number;
  tardyCount: number;
  specialCount: number;
  justifiedAbsenceCount: number;
  unjustifiedAbsenceCount: number;
}

export interface MonthlyHallReportResponse {
  hallId: string;
  year: number;
  month: number;
  caregivers: CaregiverMonthlySummary[];
}

export interface HallSummary {
  hallId: string;
  hallName: string;
  presentCount: number;
  tardyCount: number;
  specialCount: number;
  justifiedAbsenceCount: number;
  unjustifiedAbsenceCount: number;
}

export interface MonthlyCommitteeReportResponse {
  committeeId: string;
  year: number;
  month: number;
  halls: HallSummary[];
}
