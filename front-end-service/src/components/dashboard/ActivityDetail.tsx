import { useEffect } from 'react';
import { Icon } from '../Icon';
import { type Activity, type AttendResponse, MEMBERS, WD_JA, parseYmd } from './data';
import { Avatar, StatusPill, AttendBtn } from './atoms';
import { FactRow, AttendGroup } from './ActivityRow';

interface ActivityDetailProps {
  activity: Activity;
  onBack: () => void;
  onSetMe: (v: AttendResponse) => void;
}

export function ActivityDetail({ activity, onBack, onSetMe }: ActivityDetailProps) {
  const d = parseYmd(activity.date);
  const wd = WD_JA[d.getDay()];
  const lead = MEMBERS.find(m => m.id === activity.leadId)!;
  const going   = Object.entries(activity.attendance).filter(([, v]) => v === 'yes') as [string, 'yes'][];
  const maybe   = Object.entries(activity.attendance).filter(([, v]) => v === 'maybe') as [string, 'maybe'][];
  const absent  = Object.entries(activity.attendance).filter(([, v]) => v === 'no') as [string, 'no'][];
  const pending = Object.entries(activity.attendance).filter(([, v]) => v === null) as [string, null][];
  const me = activity.attendance['me'];

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onBack(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  return (
    <div style={{ animation: 'fadeIn 280ms ease', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', padding: '2px 0',
        color: 'var(--fg-muted)', fontSize: 12, fontFamily: 'inherit',
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        alignSelf: 'flex-start',
      }}>
        <Icon.Chevron dir="left" size={13} /> 一覧へ戻る
      </button>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(180deg, var(--bg-2), transparent)',
        }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: 6 }}>
            {d.getFullYear()}.{String(d.getMonth() + 1).padStart(2, '0')}.{String(d.getDate()).padStart(2, '0')} ({wd})
          </div>
          <h2 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {activity.title}
          </h2>
        </div>

        <div style={{ padding: '16px 20px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FactRow icon={<Icon.MapPin size={13} />} label="場所" value={activity.location} />
          <FactRow icon={<Icon.Clock size={13} />} label="時間" value={activity.time} />
          <FactRow icon={<Icon.Package size={13} />} label="準備担当"
            value={<>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Avatar m={lead} size={18} /> <span>{lead.name}</span>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{activity.prep}</div>
            </>}
          />
          {activity.note && (
            <div style={{
              marginTop: 2, padding: '12px 14px',
              borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)',
              fontSize: 12.5, color: 'var(--fg-muted)', lineHeight: 1.7,
            }}>
              {activity.note}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px 18px' }}>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--fg-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            参加状況 · {going.length}/{MEMBERS.length}
          </div>
          <div>
            <AttendGroup label="参加" items={going} badge="yes" />
            {maybe.length > 0 && <AttendGroup label="未定" items={maybe} badge="maybe" />}
            {absent.length > 0 && <AttendGroup label="欠席" items={absent} badge="no" />}
            {pending.length > 0 && <AttendGroup label="未回答" items={pending} badge="pending" />}
          </div>
        </div>

        <div style={{
          padding: '14px 20px 18px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>あなたの参加</div>
            {me && <StatusPill value={me} />}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <AttendBtn current={me ?? null} value="yes" label="参加" onClick={onSetMe} />
            <AttendBtn current={me ?? null} value="maybe" label="未定" onClick={onSetMe} />
            <AttendBtn current={me ?? null} value="no" label="欠席" onClick={onSetMe} />
          </div>
        </div>
      </div>
    </div>
  );
}
