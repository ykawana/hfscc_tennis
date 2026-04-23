# Participations テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-participations` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 新規追加 |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | scheduleId | S | UUID |
| SK | memberId | S | UUID |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-memberid-eventdate | memberId (S) | eventDate (S) | 会員の参加予定を日付昇順で取得 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| scheduleId | S | ✓ | UUID |
| memberId | S | ✓ | UUID |
| eventDate | S | ✓ | `YYYY-MM-DD`（GSI ソートキー用に非正規化） |
| status | S | ✓ | `REGISTERED` \| `CANCELLED` |
| registeredAt | S | ✓ | ISO 8601 |
| updatedAt | S | ✓ | ISO 8601 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| P-1 | 特定スケジュールの参加者一覧 | Query | テーブル PK=scheduleId |
| P-2 | 会員の参加予定一覧（日付昇順） | Query | hfscc-tennis-gsi-memberid-eventdate |
| P-3 | 参加状況確認（1件） | GetItem | PK=scheduleId, SK=memberId |
| P-4 | 参加登録 | PutItem | テーブル |
| P-5 | 参加キャンセル | UpdateItem (status=CANCELLED) | テーブル |

## アイテム例

```json
{
  "scheduleId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "memberId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "eventDate": "2024-05-12",
  "status": "REGISTERED",
  "registeredAt": "2024-04-20T14:30:00Z",
  "updatedAt": "2024-04-20T14:30:00Z"
}
```
