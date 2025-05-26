FROM node:20-bullseye

WORKDIR /app

COPY .npmrc ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY package.json ./apps/frontend/package.json

RUN npm install -g pnpm

RUN pnpm install

COPY . .

WORKDIR /app/apps/frontend
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "dev"]
