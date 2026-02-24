import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
});

export interface AuthResult {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export function signIn(email: string, password: string): Promise<AuthResult> {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err: Error) => {
        reject(err);
      },
      newPasswordRequired: (_userAttributes: Record<string, string>) => {
        // 仮パスワードでの初回ログイン時
        // completeNewPasswordChallenge を呼び出す必要がある
        reject({ code: 'NewPasswordRequired', user });
      },
    });
  });
}

export function completeNewPassword(
  cognitoUser: CognitoUser,
  newPassword: string,
): Promise<AuthResult> {
  return new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err: Error) => {
        reject(err);
      },
    });
  });
}

export function getCurrentSession(): Promise<CognitoUserSession | null> {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session);
    });
  });
}

export function signOut(): void {
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
}

export function getIdToken(): Promise<string | null> {
  return getCurrentSession().then((session) => {
    if (!session || !session.isValid()) return null;
    return session.getIdToken().getJwtToken();
  });
}

export function getUserGroups(): Promise<string[]> {
  return getCurrentSession().then((session) => {
    if (!session || !session.isValid()) return [];
    const payload = session.getIdToken().decodePayload();
    return (payload['cognito:groups'] as string[]) || [];
  });
}
