import { useState, useEffect } from 'react';

interface SuccessScreenProps {
  onContinue: () => void;
}

export function SuccessScreen({ onContinue }: SuccessScreenProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) { onContinue(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onContinue]);

  return (
    <div className="scene" data-screen-label="04 Success">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: 40 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
            animation: 'pop 400ms cubic-bezier(.2,.8,.2,1) both',
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" style={{
                strokeDasharray: 30, strokeDashoffset: 30,
                animation: 'draw 500ms 180ms ease forwards',
              }} />
            </svg>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, margin: '0 0 8px' }}>
            パスワードを設定しました
          </h2>
          <p className="muted" style={{ fontSize: 13.5, margin: 0, lineHeight: 1.75 }}>
            ダッシュボードへ移動します<span className="dim mono" style={{ marginLeft: 10 }}>{count} 秒</span>
          </p>
        </div>

        <button className="btn btn-ghost" onClick={onContinue} style={{ marginTop: 8 }}>
          今すぐ進む
        </button>
      </div>
      <style>{`
        @keyframes pop { from { transform: scale(.6); opacity: 0;} to { transform: scale(1); opacity: 1;} }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
