FROM node:22-alpine AS builder

RUN apk add --no-cache bash

WORKDIR /app

COPY . .

RUN npm i
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache bash

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/prisma.config.ts .
COPY --from=builder /app/wait-for-it.sh .
COPY --from=builder /app/init.sh .

RUN chmod +x init.sh
RUN chmod +x wait-for-it.sh

RUN npm ci

EXPOSE 3001

CMD ["sh", "-c", "/app/init.sh"]