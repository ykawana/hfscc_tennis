import { useState, type FormEvent } from 'react';
import { Icon } from './Icon';

interface PasswordScreenProps {
  email: string;
  onSuccess: () => void;
}

export function PasswordScreen({ email, onSuccess }: PasswordScreenProps) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [touched2, setTouched2] = useState(false);

  const rules = [
    { id: 'len', label: '8文字以上', ok: pw.length >= 8 },
  ];
  const allOk = rules.every(r => r.ok);
  const match = pw2.length > 0 && pw === pw2;
  const canSubmit = allOk && match;

  function strength(p: string): number {
    let s = 0;
    if (p.length >= 8) s += 1;
    if (p.length >= 12) s += 1;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s += 1;
    if (/\d/.test(p)) s += 1;
    if (/[^A-Za-z0-9]/.test(p)) s += 1;
    return Math.min(s, 4);
  }
  const S = strength(pw);
  const labels = ['—', '弱い', 'ふつう', '強い', 'とても強い'];

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setTimeout(() => { onSuccess(); }, 700);
  }

  return (
    <div className="scene" data-screen-label="02 Password Set">
      <div className="phone">
        <div className="card" style={{ padding: '30px 22px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-muted)',
            }}>
              <Icon.Lock />
            </div>
          </div>

          <h1 className="serif" style={{
            margin: '0 0 4px', fontSize: 24, fontWeight: 400, letterSpacing: '-0.01em', textAlign: 'center',
          }}>
            パスワードの設定
          </h1>
          <p className="muted" style={{ textAlign: 'center', fontSize: 12.5, margin: '0 0 20px', lineHeight: 1.7 }}>
            招待リンクを確認しました。<br />
            初回のパスワードを設定してください。
          </p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 18,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 10,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: 999,
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon.Check size={12} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div className="muted" style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>アカウント</div>
              <div className="mono" style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
            </div>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label>新しいパスワード</label>
              <div className="input-wrap">
                <input
                  className="input has-trail"
                  type={showPw ? 'text' : 'password'}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoFocus
                  placeholder="8文字以上"
                />
                <button type="button" className="input-trail" tabIndex={-1}
                  onClick={() => setShowPw(s => !s)}>
                  {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: i < S ? 'var(--accent)' : 'var(--border)',
                      transition: 'background 200ms',
                    }} />
                  ))}
                </div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-muted)', letterSpacing: '0.04em', minWidth: 54, textAlign: 'right' }}>
                  {labels[S]}
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {rules.map(r => (
                  <li key={r.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 12,
                    color: r.ok ? 'var(--fg)' : 'var(--fg-muted)',
                    transition: 'color 200ms',
                  }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: 999,
                      background: r.ok ? 'var(--accent-soft)' : 'transparent',
                      border: `1px solid ${r.ok ? 'var(--accent)' : 'var(--border-strong)'}`,
                      color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 200ms',
                    }}>
                      {r.ok && <Icon.Check size={10} />}
                    </span>
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="field">
              <label>パスワード(確認)</label>
              <div className="input-wrap">
                <input
                  className="input has-trail"
                  type={showPw ? 'text' : 'password'}
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  onBlur={() => setTouched2(true)}
                  placeholder="もう一度入力"
                />
              </div>
              {touched2 && pw2.length > 0 && !match && (
                <div className="error-text">パスワードが一致しません。</div>
              )}
              {match && (
                <div className="hint" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)' }}>
                  <Icon.Check size={12} /> 一致しています
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={!canSubmit || busy}
              style={{ width: '100%', padding: '15px', fontSize: 14, marginTop: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {busy ? <span className="dots">設定中</span> : <>パスワードを設定 <Icon.ArrowRight size={15} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
