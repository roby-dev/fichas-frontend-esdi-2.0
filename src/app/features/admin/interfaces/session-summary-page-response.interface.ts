import { SessionUserSummary } from './session-user-summary.interface';

export interface SessionSummaryPageResponse {
  items: SessionUserSummary[];
  total: number;
  limit: number;
  offset: number;
}
