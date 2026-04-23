# DynamoDB テーブル設計 概要

## テーブル一覧

| テーブル名 | リソース名 | PK | SK | GSI |
|-----------|-----------|----|----|-----|
| hfscc-tennis-table-{env}-members | [members.md](./members.md) | memberId | - | hfscc-tennis-gsi-email |
| hfscc-tennis-table-{env}-schedules | [schedules.md](./schedules.md) | scheduleId | - | hfscc-tennis-gsi-status-eventdate |
| hfscc-tennis-table-{env}-participations | [participations.md](./participations.md) | scheduleId | memberId | hfscc-tennis-gsi-memberid-eventdate |
| hfscc-tennis-table-{env}-duties | [duties.md](./duties.md) | scheduleId | dutyType | hfscc-tennis-gsi-memberid-eventdate |
| hfscc-tennis-table-{env}-rules | [rules.md](./rules.md) | ruleId | - | hfscc-tennis-gsi-status-sortorder |
| hfscc-tennis-table-{env}-announcements | [announcements.md](./announcements.md) | announcementId | - | hfscc-tennis-gsi-status-publishedat |

## 設計方針

- テーブルは機能単位で分割（マルチテーブル設計）
- BillingMode: PAY_PER_REQUEST
- GSI はアクセスパターンごとに必要最小限
- status を GSI のパーティションキーに使うことで、公開済み・今後の予定など絞り込みを効率化
- GSI 名称ルール: `hfscc-tennis-gsi-{partitionkey}-{sortkey}`（すべて小文字）

## アクセスパターン一覧

### 会員 (Members)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| M-1 | 会員詳細取得（by memberId） | GetItem | テーブル |
| M-2 | 会員詳細取得（by email） | Query | hfscc-tennis-gsi-email |
| M-3 | 全会員一覧 | Scan | テーブル |
| M-4 | 会員登録 | PutItem | テーブル |
| M-5 | 会員情報更新 | UpdateItem | テーブル |
| M-6 | 会員削除 | DeleteItem | テーブル |

### スケジュール (Schedules)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| S-1 | スケジュール詳細取得（by scheduleId） | GetItem | テーブル |
| S-2 | 今後の公開スケジュール一覧（日付昇順） | Query | hfscc-tennis-gsi-status-eventdate, PK=OPEN, SK>=today |
| S-3 | スケジュール作成 | PutItem | テーブル |
| S-4 | スケジュール更新 | UpdateItem | テーブル |
| S-5 | スケジュール削除（キャンセル） | UpdateItem | テーブル |

### 参加登録 (Participations)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| P-1 | 特定スケジュールの参加者一覧 | Query | テーブル PK=scheduleId |
| P-2 | 会員の参加予定一覧（日付昇順） | Query | hfscc-tennis-gsi-memberid-eventdate |
| P-3 | 参加状況確認（1件） | GetItem | PK=scheduleId, SK=memberId |
| P-4 | 参加登録 | PutItem | テーブル |
| P-5 | 参加キャンセル | UpdateItem (status=CANCELLED) | テーブル |

### 当番 (Duties)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| D-1 | 特定スケジュールの当番一覧 | Query | テーブル PK=scheduleId |
| D-2 | 会員の当番一覧（日付昇順） | Query | hfscc-tennis-gsi-memberid-eventdate |
| D-3 | 当番割り当て | PutItem | テーブル |
| D-4 | 当番変更（担当者変更） | UpdateItem | テーブル |

### 規則 (Rules)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| R-1 | 公開中の規則一覧（表示順） | Query | hfscc-tennis-gsi-status-sortorder, PK=PUBLISHED |
| R-2 | 規則詳細取得 | GetItem | テーブル |
| R-3 | 規則作成 | PutItem | テーブル |
| R-4 | 規則更新・公開 | UpdateItem | テーブル |

### お知らせ (Announcements)

| # | パターン | 操作 | インデックス |
|---|---------|------|-------------|
| A-1 | 公開済みお知らせ一覧（新着順） | Query | hfscc-tennis-gsi-status-publishedat, PK=PUBLISHED, SK desc |
| A-2 | お知らせ詳細取得 | GetItem | テーブル |
| A-3 | お知らせ作成（下書き） | PutItem | テーブル |
| A-4 | お知らせ更新・公開 | UpdateItem | テーブル |
| A-5 | お知らせ削除 | DeleteItem | テーブル |
