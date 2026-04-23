# Announcements テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-announcements` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 既存・変更あり |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | announcementId | S | UUID |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-status-publishedat | status (S) | publishedAt (S) | 公開済みお知らせを新着順で取得 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| announcementId | S | ✓ | UUID |
| title | S | ✓ | お知らせタイトル |
| body | S | ✓ | 本文（Markdown） |
| status | S | ✓ | `PUBLISHED` \| `DRAFT` |
| authorId | S | ✓ | 作成者の memberId |
| publishedAt | S |  | ISO 8601（GSI ソートキー、公開時に設定） |
| createdAt | S | ✓ | ISO 8601 |
| updatedAt | S | ✓ | ISO 8601 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| A-1 | 公開済みお知らせ一覧（新着順） | Query | hfscc-tennis-gsi-status-publishedat, PK=PUBLISHED, SK desc |
| A-2 | お知らせ詳細取得 | GetItem | テーブル |
| A-3 | お知らせ作成（下書き） | PutItem | テーブル |
| A-4 | お知らせ更新・公開 | UpdateItem | テーブル |
| A-5 | お知らせ削除 | DeleteItem | テーブル |

## アイテム例

```json
{
  "announcementId": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "title": "5月の練習スケジュールについて",
  "body": "## 5月の練習スケジュール\n\n5月の練習日程をお知らせします。\n\n...",
  "status": "PUBLISHED",
  "authorId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "publishedAt": "2024-04-25T10:00:00Z",
  "createdAt": "2024-04-24T15:00:00Z",
  "updatedAt": "2024-04-25T10:00:00Z"
}
```
