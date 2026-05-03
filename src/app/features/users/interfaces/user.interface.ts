export interface User {
  email: string;
  roles: string[];
  id?: string;
  mustChangePassword?: boolean;
}
