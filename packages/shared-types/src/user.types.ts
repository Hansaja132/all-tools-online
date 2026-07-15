export type UserRole = 'USER' | 'ADMIN';

export type AuthProviderType = 'LOCAL' | 'GOOGLE';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  provider: AuthProviderType;
  providerId: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdateDTO {
  name?: string;
  avatar?: string;
}

export interface PasswordChangeDTO {
  currentPassword?: string;
  newPassword?: string;
}
