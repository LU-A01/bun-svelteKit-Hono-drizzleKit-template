FROM oven/bun:1.2.4-slim AS base

WORKDIR /app

# パッケージマネージャをシステムにインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    ca-certificates \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Playwrightの依存関係をインストール（E2Eテスト用）
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# 特定のbunのバージョンを使用
ENV BUN_VERSION=1.2.4

# クロスプラットフォーム設定
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH

# マルチプラットフォームサポート
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# ノード依存関係用のボリュームマウントポイント
VOLUME ["/app/node_modules"]
VOLUME ["/app/frontend/node_modules"]
VOLUME ["/app/backend/node_modules"]
VOLUME ["/app/database/node_modules"]
VOLUME ["/app/shared/node_modules"]

# バンのキャッシュディレクトリを作成
RUN mkdir -p /root/.bun/install/cache && chmod -R 777 /root/.bun

# デフォルトのエントリポイントを設定
ENTRYPOINT ["bun"]
CMD ["--help"] 