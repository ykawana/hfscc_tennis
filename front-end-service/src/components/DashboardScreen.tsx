import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { type Activity, type AttendResponse, MEMBERS, SEED_ACTIVITIES, MONTH_EN, ymd, parseYmd } from './dashboard/data';
import { Avatar, IconBtn } from './dashboard/atoms';
import { ActivityRow } from './dashboard/ActivityRow';
import { ActivityDetail } from './dashboard/ActivityDetail';

export function DashboardScreen() {
  const [cursor, setCursor] = useState(new Date(2026, 3, 1));
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [navDir, setNavDir] = useState<'left' | 'right' | 'none'>('none');

  function setMyAttendance(id: string, v: AttendResponse) {
    setActivities(prev => prev.map(a =>
      a.id === id ? { ...a, attendance: { ...a.attendance, me: v } } : a
    ));
  }

  function changeMonth(delta: number) {
    setNavDir(delta > 0 ? 'right' : 'left');
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
    setSelectedId(null);
    setTimeout(() => setNavDir('none'), 420);
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (selectedId) return;
      if (e.key === 'ArrowRight') changeMonth(+1);
      if (e.key === 'ArrowLeft') changeMonth(-1);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const monthItems = activities
    .filter(a => {
      const d = parseYmd(a.date);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const selected = activities.find(a => a.id === selectedId) ?? null;

  return (
    <div className="scene" data-screen-label="05 Dashboard" style={{ alignItems: 'stretch' }}>
      <div className="phone" style={{ gap: 18 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div className="logo">
            <div className="logo-mark" />
            <div className="logo-text" style={{ fontSize: 16 }}>Activity <em>Coordination</em></div>
          </div>
          <Avatar m={MEMBERS[0]} size={32} />
        </header>

        {selected ? (
          <ActivityDetail
            activity={selected}
            onBack={() => setSelectedId(null)}
            onSetMe={(v) => setMyAttendance(selected.id, v)}
          />
        ) : (
          <>
            <div style={{ padding: '2px 2px 0' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                青葉フットボール
              </div>
              <h1 className="serif" style={{ fontSize: 24, fontWeight: 400, margin: '6px 0 2px', letterSpacing: '-0.01em' }}>
                活動の予定
              </h1>
              <p className="muted" style={{ fontSize: 12.5, margin: 0, lineHeight: 1.7 }}>
                月ごとに活動日を確認し、参加の可否を入力できます。
              </p>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: '44px 1fr 44px',
              alignItems: 'center', gap: 10,
              padding: '4px 0',
            }}>
              <IconBtn onClick={() => changeMonth(-1)} aria-label="前の月">
                <Icon.Chevron dir="left" size={15} />
              </IconBtn>

              <div style={{ textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--fg-dim)' }}>
                  {MONTH_EN[cursor.getMonth()].toUpperCase()} · {cursor.getFullYear()}
                </div>
                <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, marginTop: 2 }}>
                  {cursor.getFullYear()}年 {cursor.getMonth() + 1}月
                </div>
              </div>

              <IconBtn onClick={() => changeMonth(+1)} aria-label="次の月" style={{ justifySelf: 'end' }}>
                <Icon.Chevron dir="right" size={15} />
              </IconBtn>
            </div>

            <div key={ymd(cursor)} style={{
              display: 'flex', flexDirection: 'column', gap: 10,
              animation: navDir === 'right' ? 'slideInR 340ms cubic-bezier(.2,.8,.2,1)'
                : navDir === 'left' ? 'slideInL 340ms cubic-bezier(.2,.8,.2,1)'
                : 'fadeIn 280ms ease',
            }}>
              {monthItems.length === 0 && (
                <div className="card" style={{ padding: '30px 20px', textAlign: 'center' }}>
                  <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                    この月の活動予定はまだありません。
                  </p>
                </div>
              )}
              {monthItems.map((a, i) => (
                <ActivityRow key={a.id} activity={a} onClick={() => setSelectedId(a.id)} index={i} />
              ))}

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: 4, padding: '0 2px',
                fontSize: 10.5, color: 'var(--fg-dim)',
              }}>
                <span className="mono" style={{ letterSpacing: '0.06em' }}>← → で月を移動</span>
                <span className="mono" style={{ letterSpacing: '0.06em' }}>{monthItems.length} 件</span>
              </div>
            </div>
          </>
        )}

        <footer style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: 10.5, color: 'var(--fg-dim)' }}>
          <span className="mono" style={{ letterSpacing: '0.08em' }}>Activity Coordination · demo</span>
        </footer>
      </div>

      <style>{`
        @keyframes slideInR { from { opacity: 0; transform: translateX(18px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes slideInL { from { opacity: 0; transform: translateX(-18px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default DashboardScreen;
