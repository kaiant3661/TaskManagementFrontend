export interface User {
  userId: number;
  username?: string;
  email: string;
  password?:string;
  passwordHash?: string; // Optional for registration only
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  roleId?: number; // Role ID for assignments
  role?: {         // Optional nested object for role details
    roleId: number;
    roleName: string;
  };
  isDeleted?:boolean,
}
