import { User } from "@/features/users/interfaces/user.interface";

export interface AdminCommittee {
  id: string;
  committeeId: string;
  name: string;
  user?: User
}
