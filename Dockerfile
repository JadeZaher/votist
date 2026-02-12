# ---- Dependencies ----
FROM node:20-slim AS deps

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM node:20-slim AS build

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Runs: svelte-kit sync (generates .svelte-kit/tsconfig.json) + prisma generate + vite build
RUN npm run build

# ---- Production ----
FROM node:20-slim AS production

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

# Copy the built output and production deps
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "build"]
