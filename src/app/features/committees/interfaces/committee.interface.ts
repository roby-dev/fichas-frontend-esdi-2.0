import { User } from "@/features/users/interfaces/user.interface";

export interface Committee {
  id: string;
  committeeId: string;
  name: string;
  user: User | undefined,
}
