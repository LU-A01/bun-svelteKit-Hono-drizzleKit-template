FROM oven/bun:1.2.4-slim as base

WORKDIR /app

# 開発依存関係をインストールするためのステージ
FROM base as deps
COPY package.json bun.lockb ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
RUN bun install --frozen-lockfile

# ビルドステージ
FROM base as build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/shared/node_modules ./shared/node_modules

COPY . .
WORKDIR /app/backend
RUN bun run build

# 実行ステージ
FROM base as runtime

COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/package.json ./
COPY --from=build /app/shared ./shared

# 本番依存関係のみをインストール
RUN bun install --production --frozen-lockfile

# ヘルスチェック用の設定
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

EXPOSE ${PORT:-3000}

# 環境変数の設定
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
