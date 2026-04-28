import { User } from '@/features/users/interfaces/user.interface';
import { Child } from './child.interface';

export interface UserWithChildren {
  user: User;
  children: Child[];
}
