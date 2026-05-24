# ---- Build stage ----
FROM node:20 AS builder

WORKDIR /app

COPY package*.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Run stage ----
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json package-lock.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]
