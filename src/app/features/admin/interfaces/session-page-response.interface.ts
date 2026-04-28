import { Session } from './session.interface';

export interface SessionPageResponse {
  items: Session[];
  total: number;
  limit: number;
  offset: number;
}
