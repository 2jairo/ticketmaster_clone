FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache bash

WORKDIR /app

COPY . .

RUN pnpm i
RUN pnpm build

RUN chmod +x wait-for-it.sh

EXPOSE 3001

CMD ["sh", "-c", "/app/wait-for-it.sh mongo:27017 && pnpm start"]