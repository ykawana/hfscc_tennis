import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getCurrentSession,
  getUserGroups,
} from '../services/cognito';
import type { AuthResult } from '../services/cognito';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
}

export type SignInResult =
  | { status: 'success' }
  | { status: 'newPasswordRequired'; cognitoUser: unknown };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 起動時にセッションを復元
  useEffect(() => {
    getCurrentSession()
      .then(async (session) => {
        if (session && session.isValid()) {
          const payload = session.getIdToken().decodePayload();
          const groups = await getUserGroups();
          setUser({
            email: payload['email'] as string,
            groups,
            idToken: session.getIdToken().getJwtToken(),
          });
        }
      })
      .catch(() => {
        // セッションなし
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    try {
      const result: AuthResult = await cognitoSignIn(email, password);
      const groups = await getUserGroups();
      setUser({ email, groups, idToken: result.idToken });
      return { status: 'success' };
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as Record<string, unknown>).code === 'NewPasswordRequired') {
        return { status: 'newPasswordRequired', cognitoUser: (err as Record<string, unknown>).user };
      }
      throw err;
    }
  }, []);

  const signOut = useCallback(() => {
    cognitoSignOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
