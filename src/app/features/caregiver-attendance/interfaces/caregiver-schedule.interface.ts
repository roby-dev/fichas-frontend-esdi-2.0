export interface ScheduleBlock {
  id?: string;
  name: string;
  entryTime: string;
  exitTime?: string;
  exitRequired: boolean;
  toleranceMinutes: number;
  markingWindowMinutes: number;
}

export interface DayRule {
  dayOfWeek: number;
  isWorkingDay: boolean;
  blockIds: string[];
}

export interface SpecialDay {
  localDate: string;
  isWorkingDay: boolean;
  blockIds: string[];
}

export interface CreateScheduleVersionRequest {
  communityHallId: string;
  name: string;
  validFrom: string;
  validTo?: string;
  blocks: ScheduleBlock[];
  dayRules: DayRule[];
  specialDays?: SpecialDay[];
}

export interface CopyScheduleVersionRequest {
  targetHallId: string;
  validFrom: string;
  name: string;
}

export interface ScheduleBlockResponse {
  id: string;
  name: string;
  entryTime: string;
  exitTime: string | null;
  exitRequired: boolean;
  toleranceMinutes: number;
  markingWindowMinutes: number;
}

export interface DayRuleResponse {
  dayOfWeek: number;
  isWorkingDay: boolean;
  blockIds: string[];
}

export interface SpecialDayResponse {
  localDate: string;
  isWorkingDay: boolean;
  blockIds: string[];
}

export interface ScheduleVersionResponse {
  id: string;
  communityHallId: string;
  name: string;
  validFrom: string;
  validTo: string | null;
  blocks: ScheduleBlockResponse[];
  dayRules: DayRuleResponse[];
  specialDays: SpecialDayResponse[];
}
