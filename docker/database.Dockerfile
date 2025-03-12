FROM oven/bun:1.2.4-slim as base

WORKDIR /app

# 依存関係をインストールするためのステージ
FROM base as deps
COPY package.json bun.lockb ./
COPY database/package.json ./database/
COPY shared/package.json ./shared/
RUN bun install --frozen-lockfile

# SQLiteデータベースファイル用のボリューム
VOLUME /app/database/data

WORKDIR /app/database

# スキーマとマイグレーションをコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/database/node_modules ./database/node_modules
COPY database/schema ./schema
COPY database/migrations ./migrations
COPY database/migrate.ts ./
COPY database/package.json ./

# このコンテナはTursoの代わりにローカルSQLiteファイルを使用
ENV DATABASE_URL=file:/app/database/data/dev.db

# マイグレーションをセットアップスクリプトとして実行
CMD ["bun", "run", "migrate"]
