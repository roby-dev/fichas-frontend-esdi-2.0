export interface AuditEvent {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorUserId: string;
  occurredAt: string;
  before: any;
  after: any;
  changedFields: string[];
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}
