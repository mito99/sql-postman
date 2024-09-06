FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm  # pnpm をグローバルにインストール
RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20-alpine AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public /app/public

EXPOSE 3000

CMD ["pnpm", "start"]