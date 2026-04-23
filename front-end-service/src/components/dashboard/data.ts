export type AttendanceValue = 'yes' | 'maybe' | 'no' | null;
export type AttendResponse = 'yes' | 'maybe' | 'no';

export interface Member {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface Activity {
  id: string;
  date: string;
  title: string;
  location: string;
  time: string;
  leadId: string;
  prep: string;
  note?: string;
  attendance: Record<string, AttendanceValue>;
}

export const MEMBERS: Member[] = [
  { id: 'me', name: '田中 真司', initial: '田', color: 'oklch(0.78 0.06 210)' },
  { id: 'sa', name: '佐藤 美咲', initial: '佐', color: 'oklch(0.78 0.06 150)' },
  { id: 'su', name: '鈴木 健',   initial: '鈴', color: 'oklch(0.78 0.06  70)' },
  { id: 'ta', name: '高橋 結衣', initial: '高', color: 'oklch(0.78 0.06  20)' },
  { id: 'wa', name: '渡辺 陽介', initial: '渡', color: 'oklch(0.78 0.06 280)' },
  { id: 'it', name: '伊藤 彩',   initial: '伊', color: 'oklch(0.78 0.06 330)' },
  { id: 'ya', name: '山本 拓海', initial: '山', color: 'oklch(0.78 0.06 110)' },
  { id: 'na', name: '中村 穂花', initial: '中', color: 'oklch(0.78 0.06 250)' },
];

export const SEED_ACTIVITIES: Activity[] = [
  { id: 'm1', date: '2026-03-14', title: '春の合同練習',
    location: '市民体育館 第2アリーナ', time: '10:00 – 13:00',
    leadId: 'sa', prep: 'ビブス・ホワイトボード',
    note: '新年度に向けた基礎練習を中心に行いました。',
    attendance: { me: 'yes', sa: 'yes', su: 'yes', ta: 'yes', wa: 'no', it: 'yes', ya: 'yes', na: 'maybe' } },
  { id: 'm2', date: '2026-03-21', title: 'OB戦',
    location: '青葉公園グラウンド', time: '13:00 – 16:00',
    leadId: 'su', prep: 'ユニフォーム・記念品',
    note: 'OB 10 名ほど参加。',
    attendance: { me: 'yes', sa: 'yes', su: 'yes', ta: 'no', wa: 'yes', it: 'yes', ya: 'no', na: 'yes' } },
  { id: 'm3', date: '2026-03-28', title: '月末ミーティング',
    location: 'オンライン(Meet)', time: '20:00 – 21:00',
    leadId: 'me', prep: '議事録テンプレ',
    note: '新年度の役割確認。',
    attendance: { me: 'yes', sa: 'yes', su: 'maybe', ta: 'yes', wa: 'yes', it: 'yes', ya: 'yes', na: 'yes' } },
  { id: 'a1', date: '2026-04-22', title: '週末練習会',
    location: '市民体育館 第2アリーナ', time: '09:00 – 12:00',
    leadId: 'sa', prep: 'ビブス・タイマー・救急箱',
    note: '初参加のメンバーがいます。ストレッチから丁寧に進めましょう。',
    attendance: { me: null, sa: 'yes', su: 'yes', ta: 'no', wa: 'yes', it: 'maybe', ya: 'yes', na: 'yes' } },
  { id: 'a2', date: '2026-04-25', title: '交流試合 vs. さくら',
    location: 'さくら運動場', time: '13:30 – 16:30',
    leadId: 'su', prep: 'ユニフォーム・配車表・飲料',
    note: '集合は現地。駐車場は北門側が空きやすいです。',
    attendance: { me: null, sa: 'yes', su: 'yes', ta: 'yes', wa: 'no', it: 'yes', ya: 'maybe', na: 'yes' } },
  { id: 'a3', date: '2026-04-28', title: '平日ナイター練習',
    location: '青葉公園グラウンド', time: '19:00 – 21:00',
    leadId: 'ta', prep: 'ナイター照明受付・コーン',
    note: '雨天時は 18:00 までに中止連絡します。',
    attendance: { me: null, sa: 'maybe', su: 'yes', ta: 'yes', wa: 'yes', it: 'no', ya: 'yes', na: 'maybe' } },
  { id: 'y1', date: '2026-05-02', title: 'GW合同練習',
    location: '中央スポーツセンター', time: '10:00 – 15:00',
    leadId: 'wa', prep: '昼食手配・冷却剤・記録用ノート',
    note: '長時間の活動です。水分を多めに持参してください。',
    attendance: { me: null, sa: 'yes', su: 'yes', ta: 'yes', wa: 'yes', it: 'yes', ya: 'yes', na: 'no' } },
  { id: 'y2', date: '2026-05-09', title: 'ミーティング',
    location: 'オンライン(Meet)', time: '20:00 – 21:00',
    leadId: 'me', prep: '議題・議事録テンプレ',
    note: '次期大会に向けた役割分担の相談です。',
    attendance: { me: null, sa: 'yes', su: 'maybe', ta: 'yes', wa: 'yes', it: 'yes', ya: 'yes', na: 'yes' } },
  { id: 'y3', date: '2026-05-23', title: '地区大会(予選)',
    location: '県営総合運動場', time: '09:00 – 17:00',
    leadId: 'ta', prep: 'ユニフォーム・エントリーリスト・救急箱',
    note: '集合は 8:30。駐車券の手配は済んでいます。',
    attendance: { me: null, sa: 'yes', su: 'yes', ta: 'yes', wa: 'yes', it: 'maybe', ya: 'yes', na: 'yes' } },
];

export const MONTH_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const WD_JA = ['日','月','火','水','木','金','土'];

export function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseYmd(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
