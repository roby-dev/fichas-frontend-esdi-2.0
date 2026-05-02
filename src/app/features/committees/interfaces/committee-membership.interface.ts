export interface CommitteeMembership {
  id: string;
  committeeRef: string;
  userRef: string;
  committee: {
    id: string;
    committeeId: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}
