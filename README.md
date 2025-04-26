# TCG App

TCG（トレーディングカードゲーム）アプリケーションです。Next.jsを使用して構築されたモダンなWebアプリケーションです。

## 技術スタック

- **フロントエンド**
  - Next.js 15.2.0
  - React 18.3.1
  - TailwindCSS
  - Radix UI
  - Font Awesome

- **バックエンド**
  - Next.js API Routes
  - Prisma
  - Neon Database (PostgreSQL)
  - NextAuth.js

- **その他の主要なライブラリ**
  - FullCalendar
  - Zod (バリデーション)
  - Argon2 (パスワードハッシュ化)

## 開発環境のセットアップ

1. リポジトリのクローン
```bash
git clone [repository-url]
cd tcg_app
```

2. 依存関係のインストール
```bash
pnpm install
```

3. 環境変数の設定
`.env`ファイルを作成し、必要な環境変数を設定します。

4. データベースのセットアップ
```bash
pnpm prisma generate
pnpm prisma db push
```

5. 開発サーバーの起動
```bash
pnpm dev
```

## 主な機能

- カード管理
- カレンダー機能
- ユーザー認証
- データベース連携

## デプロイ

Vercelを使用してデプロイされています。

## ライセンス

[MIT License](LICENSE)
