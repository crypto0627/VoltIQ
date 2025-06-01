# 第 1 階段：用 Node 打包
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# 啟用 pnpm + 安裝依賴
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# 編譯 frontend 專案（依照 monorepo filter）
RUN pnpm run build --filter=frontend

# 第 2 階段：用 NGINX serve 靜態檔案
FROM nginx:alpine

# 清空預設 index.html
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/apps/frontend/out /usr/share/nginx/html

EXPOSE 80

# 啟動 NGINX
CMD ["nginx", "-g", "daemon off;"]
