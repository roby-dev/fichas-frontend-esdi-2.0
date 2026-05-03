export interface CommitteeChildCount {
  committeeId: string;
  name: string;
  count: number;
}

export interface CommunityHallChildCount {
  hallId: string;
  name: string;
  committeeId: string;
  committeeName: string;
  count: number;
}

export interface ActiveSignalCount {
  signal: string;
  count: number;
}

export interface ActiveSignalsBreakdown {
  total: number;
  byType: ActiveSignalCount[];
}

export interface DashboardStatsResponse {
  childrenByCommittee: CommitteeChildCount[];
  childrenByCommunityHall: CommunityHallChildCount[];
  activeSignals: ActiveSignalsBreakdown;
}
