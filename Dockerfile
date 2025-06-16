FROM node:24-slim@sha256:5ae787590295f944e7dc200bf54861bac09bf21b5fdb4c9b97aee7781b6d95a2

# Install OpenSSL
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the entire project first
COPY . .

# Install all dependencies including peer dependencies
RUN npm install

# Generate Prisma client separately, allowing failures for other generators
RUN npx prisma generate --generator client || true && \
    npx prisma generate --generator markdown || true

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]