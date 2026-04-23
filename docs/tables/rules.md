# Rules テーブル設計

## 基本情報

| 項目 | 値 |
|------|----|
| テーブル名 | `hfscc-tennis-table-{env}-rules` |
| BillingMode | PAY_PER_REQUEST |
| ステータス | 既存・変更あり |

## キー設計

| キー | 属性名 | 型 | 説明 |
|------|--------|----|------|
| PK | ruleId | S | UUID |

## GSI

| インデックス名 | PK | SK | 用途 |
|--------------|----|----|------|
| hfscc-tennis-gsi-status-sortorder | status (S) | sortOrder (N) | 公開中の規則を表示順で取得 |

## 属性一覧

| 属性名 | 型 | 必須 | 説明 |
|-------|-----|------|------|
| ruleId | S | ✓ | UUID |
| title | S | ✓ | 規則のタイトル |
| content | S | ✓ | 本文（Markdown） |
| category | S | ✓ | `COURT` \| `MEMBERSHIP` \| `FEE` \| `GENERAL` |
| sortOrder | N | ✓ | 表示順（昇順） |
| status | S | ✓ | `PUBLISHED` \| `DRAFT` |
| updatedAt | S | ✓ | ISO 8601 |

## category 一覧

| 値 | 説明 |
|----|------|
| COURT | コート利用規則 |
| MEMBERSHIP | 会員規則 |
| FEE | 会費・費用規則 |
| GENERAL | 一般規則 |

## アクセスパターン

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| R-1 | 公開中の規則一覧（表示順） | Query | hfscc-tennis-gsi-status-sortorder, PK=PUBLISHED |
| R-2 | 規則詳細取得 | GetItem | テーブル |
| R-3 | 規則作成 | PutItem | テーブル |
| R-4 | 規則更新・公開 | UpdateItem | テーブル |

## アイテム例

```json
{
  "ruleId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "title": "コート利用規則",
  "content": "## コート利用規則\n\n1. 利用前にコートを清掃すること\n2. ...",
  "category": "COURT",
  "sortOrder": 1,
  "status": "PUBLISHED",
  "updatedAt": "2024-04-01T09:00:00Z"
}
```
