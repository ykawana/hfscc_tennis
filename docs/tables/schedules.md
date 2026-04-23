# Schedules テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-schedules` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 既存・変更あり |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | scheduleId | S | UUID |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-status-eventdate | status (S) | eventDate (S) | 公開中スケジュールを日付昇順で取得 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| scheduleId | S | ✓ | UUID |
| title | S | ✓ | 例: "5月定例練習" |
| eventDate | S | ✓ | `YYYY-MM-DD` 形式 |
| startTime | S | ✓ | `HH:MM` 形式 |
| endTime | S | ✓ | `HH:MM` 形式 |
| location | S | ✓ | 場所名（例: "深沢テニスコート 1番"） |
| capacity | N | ✓ | 定員人数 |
| status | S | ✓ | `OPEN` \| `CLOSED` \| `CANCELLED` |
| createdAt | S | ✓ | ISO 8601 |
| updatedAt | S | ✓ | ISO 8601 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| S-1 | スケジュール詳細取得（by scheduleId） | GetItem | テーブル |
| S-2 | 今後の公開スケジュール一覧（日付昇順） | Query | hfscc-tennis-gsi-status-eventdate, PK=OPEN, SK>=today |
| S-3 | スケジュール作成 | PutItem | テーブル |
| S-4 | スケジュール更新 | UpdateItem | テーブル |
| S-5 | スケジュール削除（キャンセル） | UpdateItem | テーブル |

## アイテム例

```json
{
  "scheduleId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "title": "5月定例練習",
  "eventDate": "2024-05-12",
  "startTime": "09:00",
  "endTime": "12:00",
  "location": "深沢テニスコート 1番",
  "capacity": 20,
  "status": "OPEN",
  "createdAt": "2024-04-15T10:00:00Z",
  "updatedAt": "2024-04-15T10:00:00Z"
}
```
