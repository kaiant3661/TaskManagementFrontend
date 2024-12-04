export interface UserProfile {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash?: string; // Optional for updates
    passwordSalt?: string; // Optional for updates
    roleId: number;
    role?: { 
      roleId: number;
      roleName: string;
    };
    createdAt?: string; // Optional for updates
    updatedAt?: string | null;
    isDeleted?: boolean; // Optional for updates
    deletedAt?: string | null;
  }
  