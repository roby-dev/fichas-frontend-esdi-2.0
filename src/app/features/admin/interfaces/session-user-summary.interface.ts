export interface SessionUserSummary {
  userId: string;
  email: string;
  roles: string[];
  isOnline: boolean;
  totalSessions: number;
  activeSessions: number;
  lastSeenAt: string;
  lastIpAddress: string;
  lastUserAgent: string;
}
