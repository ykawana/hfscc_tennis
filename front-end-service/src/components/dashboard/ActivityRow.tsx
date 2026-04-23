import { type ReactNode } from 'react';
import { Icon } from '../Icon';
import { type Activity, type AttendanceValue, MEMBERS, WD_JA, parseYmd } from './data';
import { Avatar, StatusDot, StatusPill } from './atoms';

interface ActivityRowProps {
  activity: Activity;
  onClick: () => void;
  index: number;
}

export function ActivityRow({ activity, onClick, index }: ActivityRowProps) {
  const d = parseYmd(activity.date);
  const wd = WD_JA[d.getDay()];
  const isPast = d < new Date(2026, 3, 20);
  const me = activity.attendance['me'];
  const goingCount = Object.values(activity.attendance).filter(v => v === 'yes').length;

  return (
    <button onClick={onClick}
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr auto',
        gap: 14, alignItems: 'center',
        padding: '14px 16px',
        background: 'var(--panel)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'inherit', textAlign: 'left', cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 160ms, background 160ms',
        animation: `rowIn 380ms ${index * 40}ms cubic-bezier(.2,.8,.2,1) both`,
        opacity: isPast ? 0.72 : 1,
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
        <div className="mono" style={{
          fontSize: 10, letterSpacing: '0.08em',
          color: d.getDay() === 0 ? 'var(--danger)' : d.getDay() === 6 ? 'var(--accent)' : 'var(--fg-dim)',
        }}>
          {wd}·{String(d.getMonth() + 1).padStart(2, '0')}
        </div>
        <div className="serif" style={{ fontSize: 30, lineHeight: 1, fontWeight: 400, marginTop: 2 }}>
          {d.getDate()}
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div style={{
            fontSize: 14, fontWeight: 500, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {activity.title}
          </div>
          {isPast && (
            <span className="mono" style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 999,
              border: '1px solid var(--border-strong)', color: 'var(--fg-dim)', letterSpacing: '0.06em',
            }}>終了</span>
          )}
        </div>
        <div style={{
          fontSize: 11.5, color: 'var(--fg-muted)', lineHeight: 1.5,
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon.Clock size={11} />{activity.time}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            <Icon.MapPin size={11} />{activity.location}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <StatusPill value={me ?? null} past={isPast} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 10.5, color: 'var(--fg-dim)',
        }} className="mono">
          <Icon.Users size={11} /> {goingCount}/{MEMBERS.length}
        </div>
      </div>

      <style>{`
        @keyframes rowIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </button>
  );
}

interface FactRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export function FactRow({ icon, label, value }: FactRowProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', alignItems: 'start', gap: 12 }}>
      <div className="muted" style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6, paddingTop: 2 }}>
        <span style={{ color: 'var(--fg-dim)' }}>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55 }}>{value}</div>
    </div>
  );
}

interface AttendGroupProps {
  label: string;
  items: [string, AttendanceValue][];
  badge: AttendanceValue | 'pending';
}

export function AttendGroup({ label, items, badge }: AttendGroupProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      padding: '10px 0', borderTop: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <StatusDot value={badge} />
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{label}</span>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-dim)' }}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        {items.map(([mid]) => {
          const m = MEMBERS.find(x => x.id === mid);
          if (!m) return null;
          return (
            <div key={mid} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px 2px 2px',
              borderRadius: 999, background: 'var(--bg-2)', border: '1px solid var(--border)',
              fontSize: 11.5,
            }}>
              <Avatar m={m} size={18} />
              <span>{m.name.split(' ')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
