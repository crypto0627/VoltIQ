FROM node:20-alpine AS base

WORKDIR /app

COPY . .
# 啟用 corepack 並安裝依賴（以根目錄為基準）
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# 用正確的 filter 建置 frontend
RUN pnpm run build --filter=frontend

# 啟動 dev server（filter 同步）
CMD ["pnpm", "run", "dev", "--filter=frontend"]
