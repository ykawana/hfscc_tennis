# 東深沢スポーツ・文化クラブ テニス部 Web サイト

東深沢スポーツ・文化クラブ テニス部の会員向け Web サイトです。

## ディレクトリ構成

```
/
├── front-end-static/       # 静的サイト（公開ランディングページ）
├── front-end-service/      # React SPA（会員向け機能）
├── api/                    # OpenAPI 定義
├── back-end/               # Go Lambda 関数
├── deploy/                 # デプロイ関連（SAM テンプレート、スクリプト）
├── docs/                   # 設計ドキュメント
├── e2e/                    # E2E テスト（Newman 等）
├── .devcontainer/          # 開発コンテナ設定
└── .github/                # GitHub Actions
```

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド（静的） | HTML / CSS |
| フロントエンド（SPA） | React + TypeScript（Vite） |
| バックエンド | Go（AWS Lambda） |
| API 定義 | OpenAPI 3.0 |
| インフラ | AWS（API Gateway, Lambda, DynamoDB, S3, CloudFront, Cognito） |
| IaC | AWS SAM / CloudFormation |
| CI/CD | GitHub Actions |

## 開発手順

### フロントエンド（SPA）

```bash
cd front-end-service
npm install
npm run dev
```

### バックエンド

```bash
cd back-end
go build ./...
go test ./...
```

### E2E テスト

```bash
cd e2e
newman run <collection.json>
```
