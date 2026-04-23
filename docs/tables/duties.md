# Duties テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-duties` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 新規追加 |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | scheduleId | S | UUID |
| SK | dutyType | S | 当番種別 |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-memberid-eventdate | memberId (S) | eventDate (S) | 会員の当番一覧を日付昇順で取得 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| scheduleId | S | ✓ | UUID |
| dutyType | S | ✓ | `COURT_PREP` \| `COURT_CLEANUP` \| `BALL_MANAGER` \| `OTHER` |
| memberId | S | ✓ | UUID |
| memberDisplayName | S | ✓ | 表示名（非正規化） |
| eventDate | S | ✓ | `YYYY-MM-DD`（GSI ソートキー用） |
| createdAt | S | ✓ | ISO 8601 |
| updatedAt | S | ✓ | ISO 8601 |

## dutyType 一覧

| 値 | 説明 |
|----|------|
| COURT_PREP | コート準備 |
| COURT_CLEANUP | コート片付け |
| BALL_MANAGER | ボール管理 |
| OTHER | その他 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| D-1 | 特定スケジュールの当番一覧 | Query | テーブル PK=scheduleId |
| D-2 | 会員の当番一覧（日付昇順） | Query | hfscc-tennis-gsi-memberid-eventdate |
| D-3 | 当番割り当て | PutItem | テーブル |
| D-4 | 当番変更（担当者変更） | UpdateItem | テーブル |

## アイテム例

```json
{
  "scheduleId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "dutyType": "COURT_PREP",
  "memberId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "memberDisplayName": "田中 花子",
  "eventDate": "2024-05-12",
  "createdAt": "2024-04-20T10:00:00Z",
  "updatedAt": "2024-04-20T10:00:00Z"
}
```
