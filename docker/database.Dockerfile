FROM oven/bun:1.2.4-slim AS base

WORKDIR /app

# パッケージマネージャをシステムにインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ノードモジュールのパスを適切に設定
ENV PATH=/app/node_modules/.bin:$PATH

# 依存関係をインストールするためのステージ
FROM base AS deps
COPY package.json ./
# ワークスペースディレクトリを作成
RUN mkdir -p frontend backend database shared
COPY database/package.json ./database/
COPY shared/package.json ./shared/
# ワークスペースのpackage.jsonを作成
RUN echo '{"name":"frontend","version":"0.0.1","private":true}' > ./frontend/package.json
RUN echo '{"name":"backend","version":"0.0.1","private":true}' > ./backend/package.json
# ロックファイルが存在するかを確認し、存在する場合のみコピー
RUN if [ -f /bun.lockb ]; then cp /bun.lockb ./; fi
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install

# 実行ステージ
FROM base AS runtime

# SQLiteデータベースファイル用のボリューム
VOLUME /app/database/data

WORKDIR /app/database

# スキーマとマイグレーションをコピー
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/database/node_modules /app/database/node_modules
COPY database/schema ./schema
COPY database/migrations ./migrations
COPY database/migrate.ts ./
COPY database/package.json ./

# データディレクトリを作成して権限を設定
RUN mkdir -p /app/database/data && chmod 777 /app/database/data

# このコンテナはTursoの代わりにローカルSQLiteファイルを使用
ENV DATABASE_URL=file:/app/database/data/dev.db

# マイグレーションをセットアップスクリプトとして実行
CMD ["bun", "run", "migrate"]
