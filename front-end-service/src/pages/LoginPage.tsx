import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { completeNewPassword } from '../services/cognito';
import { CognitoUser } from 'amazon-cognito-identity-js';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<CognitoUser | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);
      if (result.status === 'newPasswordRequired') {
        setPendingUser(result.cognitoUser as CognitoUser);
      } else {
        navigate('/announcements');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('ログインに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;
    setError('');
    setLoading(true);

    try {
      await completeNewPassword(pendingUser, newPassword);
      navigate('/announcements');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('パスワード変更に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初回パスワード変更画面
  if (pendingUser) {
    return (
      <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
        <h1>パスワード変更</h1>
        <p>初回ログインのため、新しいパスワードを設定してください。</p>
        <form onSubmit={handleNewPassword}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="newPassword">新しいパスワード</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: '8px 24px' }}>
            {loading ? '変更中...' : 'パスワードを変更'}
          </button>
        </form>
      </div>
    );
  }

  // ログイン画面
  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>ログイン</h1>
      <p>東深沢スポーツ・文化クラブ テニス部</p>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '8px 24px' }}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
