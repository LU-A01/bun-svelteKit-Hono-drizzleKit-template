FROM oven/bun:1.2.4-slim AS base

WORKDIR /app

# パッケージマネージャをシステムにインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ビルド引数と環境変数
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# ノードモジュールのパスを適切に設定
ENV PATH=/app/node_modules/.bin:$PATH

# 開発依存関係をインストールするためのステージ
FROM base AS deps
COPY package.json ./
# ワークスペースディレクトリを作成
RUN mkdir -p frontend backend database shared
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/
# ワークスペースのpackage.jsonを作成
RUN echo '{"name":"backend","version":"0.0.1","private":true}' > ./backend/package.json
RUN echo '{"name":"database","version":"0.0.1","private":true}' > ./database/package.json
# ロックファイルが存在するかを確認し、存在する場合のみコピー
RUN if [ -f /bun.lockb ]; then cp /bun.lockb ./; else echo "bun.lockbファイルが見つかりません"; fi
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install

# ビルドステージ - 本番環境用
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules

# ソースコードをコピー
COPY frontend ./frontend
COPY shared ./shared
COPY package.json ./
WORKDIR /app/frontend
RUN bun run build

# 開発環境ステージ - ホットリロード対応
FROM base AS development

# node_modulesをコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules

# 開発に必要なソースコードをコピー
COPY frontend ./frontend
COPY shared ./shared
COPY package.json ./

# ヘルスチェック用の設定
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT_FRONTEND:-5173}/ || exit 1

EXPOSE ${PORT_FRONTEND:-5173}

# 開発モードのデフォルトコマンド
WORKDIR /app/frontend
CMD ["bun", "run", "dev"]

# 本番環境実行ステージ
FROM base AS production

COPY --from=build /app/frontend/build ./build
COPY --from=build /app/frontend/package.json ./

# 本番依存関係のみをインストール
RUN --mount=type=cache,id=bun-cache,target=/root/.bun/install/cache \
    bun install --production

# ヘルスチェック用の設定
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT_FRONTEND:-5173}/ || exit 1

EXPOSE ${PORT_FRONTEND:-5173}

# 環境変数の設定
ENV NODE_ENV=production

CMD ["bun", "run", "start"]

# NODE_ENVに基づいて適切なステージを選択
FROM ${NODE_ENV:-development} AS final
