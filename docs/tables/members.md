# Members テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-members` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 既存・変更あり |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | memberId | S | UUID |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-email | email (S) | - | メールアドレスで会員を一意検索 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| memberId | S | ✓ | UUID |
| email | S | ✓ | メールアドレス（Cognito ユーザー名と一致） |
| displayName | S | ✓ | 表示名（例: 田中 花子） |
| status | S | ✓ | `ACTIVE` \| `INACTIVE` |
| createdAt | S | ✓ | ISO 8601 |
| updatedAt | S | ✓ | ISO 8601 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| M-1 | 会員詳細取得（by memberId） | GetItem | テーブル |
| M-2 | 会員詳細取得（by email） | Query | hfscc-tennis-gsi-email |
| M-3 | 全会員一覧 | Scan | テーブル |
| M-4 | 会員登録 | PutItem | テーブル |
| M-5 | 会員情報更新 | UpdateItem | テーブル |
| M-6 | 会員削除 | DeleteItem | テーブル |

## アイテム例

```json
{
  "memberId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "hanako@example.com",
  "displayName": "田中 花子",
  "status": "ACTIVE",
  "createdAt": "2024-04-01T09:00:00Z",
  "updatedAt": "2024-04-01T09:00:00Z"
}
```
