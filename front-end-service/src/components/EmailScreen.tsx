import { Icon } from './Icon';

interface EmailScreenProps {
  email: string;
  onOpenLink: () => void;
}

export function EmailScreen({ onOpenLink, email }: EmailScreenProps) {
  return (
    <div className="scene" data-screen-label="01 Invite Email">
      <div className="phone" style={{ gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div className="logo">
            <div className="logo-mark" />
            <div className="logo-text" style={{ fontSize: 17 }}>Activity <em>Coordination</em></div>
          </div>
          <div className="mono" style={{ fontSize: 9.5, color: 'var(--fg-dim)', letterSpacing: '0.08em' }}>
            INVITATION
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 18px 14px',
            borderBottom: '1px solid var(--border)',
            fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div><span className="muted" style={{ marginRight: 10 }}>From</span>Activity Coordination</div>
            <div className="mono dim" style={{ fontSize: 11 }}>no-reply@act-coord.app</div>
            <div style={{ fontWeight: 500, marginTop: 4, lineHeight: 1.4 }}>
              【Activity Coordination】アカウント招待のお知らせ
            </div>
          </div>

          <div style={{ padding: '20px 20px 22px', fontSize: 13.5, lineHeight: 1.8, color: 'var(--fg)' }}>
            <p style={{ marginTop: 0 }}>田中 さま</p>
            <p>
              「<span className="serif" style={{ fontSize: '1.05em' }}>Activity Coordination</span>」にご招待いただきありがとうございます。<br />
              下記のボタンから、パスワードを設定してご利用を開始してください。
            </p>

            <div style={{
              margin: '16px 0 14px',
              padding: '14px 16px',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-2)',
              border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 10,
              fontSize: 12.5,
            }}>
              <div>
                <div className="muted" style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>アカウント</div>
                <div className="mono" style={{ fontSize: 13 }}>{email}</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>有効期限</div>
                <div style={{ fontSize: 12.5 }}>発行から 72 時間以内(1 回限り有効)</div>
              </div>
            </div>

            <button className="btn btn-primary" onClick={onOpenLink}
              style={{ width: '100%', padding: '14px', fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 }}>
              パスワードを設定する <Icon.ArrowRight size={15} />
            </button>

            <p className="muted" style={{ fontSize: 11.5, marginTop: 14, lineHeight: 1.75 }}>
              このリンクはあなた専用の一時リンクです。他の方に転送しないでください。<br />
              <span className="mono dim" style={{ wordBreak: 'break-all', fontSize: 10.5 }}>
                https://act-coord.app/setup?t=4f7a9c2e8b11d60a
              </span>
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0 12px' }} />
            <p className="muted" style={{ fontSize: 11, margin: 0, lineHeight: 1.7 }}>
              72 時間を過ぎた場合は、リンクが失効します。再送をご希望の場合はグループ管理者にご連絡ください。
            </p>
          </div>
        </div>

        <div className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)', textAlign: 'center', letterSpacing: '0.06em', padding: '2px 0' }}>
          ↑ 招待メールのモック
        </div>
      </div>
    </div>
  );
}
