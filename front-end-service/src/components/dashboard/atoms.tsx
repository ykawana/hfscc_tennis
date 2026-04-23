import { type ButtonHTMLAttributes } from 'react';
import { type Member, type AttendanceValue, type AttendResponse } from './data';

interface AvatarProps {
  m: Member;
  size?: number;
}

export function Avatar({ m, size = 28 }: AvatarProps) {
  return (
    <span style={{
      display: 'inline-flex', verticalAlign: 'middle',
      width: size, height: size, borderRadius: 999,
      background: m.color, color: '#0f1115',
      fontWeight: 700, fontSize: Math.max(9, size * 0.42),
      alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border-strong)', flexShrink: 0,
    }}>{m.initial}</span>
  );
}

interface StatusDotProps {
  value: AttendanceValue | 'pending';
}

export function StatusDot({ value }: StatusDotProps) {
  const color = value === 'yes' ? 'var(--success)'
    : value === 'no' ? 'var(--danger)'
    : value === 'maybe' ? 'var(--accent)'
    : 'var(--fg-dim)';
  return <span style={{ width: 5, height: 5, borderRadius: 999, background: color, display: 'inline-block' }} />;
}

interface StatusPillProps {
  value: AttendanceValue;
  past?: boolean;
}

export function StatusPill({ value, past }: StatusPillProps) {
  if (!value) {
    return <span style={{
      fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
      border: '1px dashed var(--border-strong)', color: past ? 'var(--fg-dim)' : 'var(--fg-muted)',
    }}>未回答</span>;
  }
  const map: Record<string, { label: string; color: string }> = {
    yes:   { label: '参加', color: 'var(--success)' },
    maybe: { label: '未定', color: 'var(--accent)' },
    no:    { label: '欠席', color: 'var(--danger)' },
  };
  const s = map[value];
  return (
    <span style={{
      fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
      background: `color-mix(in oklch, ${s.color} 16%, transparent)`,
      color: s.color,
      border: `1px solid color-mix(in oklch, ${s.color} 30%, transparent)`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: s.color }} />
      {s.label}
    </span>
  );
}

interface AttendBtnProps {
  current: AttendanceValue;
  value: AttendResponse;
  label: string;
  onClick: (v: AttendResponse) => void;
}

export function AttendBtn({ current, value, label, onClick }: AttendBtnProps) {
  const active = current === value;
  const accent = value === 'yes' ? 'var(--success)' : value === 'no' ? 'var(--danger)' : 'var(--accent)';
  return (
    <button onClick={() => onClick(value)} style={{
      padding: '12px 8px', borderRadius: 10,
      border: '1px solid ' + (active ? accent : 'var(--border-strong)'),
      background: active ? 'color-mix(in oklch, ' + accent + ' 14%, transparent)' : 'var(--panel)',
      color: 'var(--fg)', fontSize: 12.5, fontWeight: 500,
      transition: 'all 160ms', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
    }}>
      <StatusDot value={value} />{label}
    </button>
  );
}

type IconBtnProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function IconBtn({ children, style, ...rest }: IconBtnProps) {
  return (
    <button {...rest} style={{
      width: 40, height: 40,
      border: '1px solid var(--border)', background: 'var(--panel)',
      borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--fg-muted)', cursor: 'pointer',
      transition: 'all 160ms',
      ...style,
    }}>{children}</button>
  );
}
