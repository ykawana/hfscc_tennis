export interface AuthUser {
  email: string;
  groups: string[];
  idToken: string;
}

export type UserRole = 'admin' | 'member';

export function isAdmin(user: AuthUser | null): boolean {
  return user?.groups.includes('admin') ?? false;
}
