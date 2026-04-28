export interface SessionUser {
  id: string;
  email: string;
  roles: string[];
}

export interface Session {
  id: string;
  userId: string;
  tokenId: string;
  active: boolean;
  ipAddress: string;
  userAgent: string;
  user?: SessionUser;
}
