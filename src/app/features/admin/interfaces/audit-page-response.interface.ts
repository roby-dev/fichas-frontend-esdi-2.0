import { AuditEvent } from './audit-event.interface';

export interface AuditPageResponse {
  items: AuditEvent[];
  total: number;
  limit: number;
  offset: number;
}
