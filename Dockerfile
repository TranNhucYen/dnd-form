# ---------------------------------------------------
# Stage 1: Base (Node.js 24 + pnpm 9)
# ---------------------------------------------------
ARG NODE_VERSION=24-bookworm-slim

FROM node:${NODE_VERSION} AS base
RUN npm install -g pnpm@9.15.9
WORKDIR /app

# ---------------------------------------------------
# Stage 2: Dependencies
# ---------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy package manifests and postinstall scripts
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./
COPY scripts ./scripts

# Skip bundled Chromium download during package installation
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN pnpm install --frozen-lockfile

# ---------------------------------------------------
# Stage 3: Builder (Next.js standalone build)
# ---------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN pnpm build

# --------------------------------------------------------
# Stage 4: Runner (Node.js + Google Chrome Stable + Fonts)
# --------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install Google Chrome Stable and Unicode fonts for Puppeteer PDF rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fontconfig \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends google-chrome-stable \
    && fc-cache -f -v \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/lib/node_modules/corepack \
              /usr/local/bin/npm \
              /usr/local/bin/npx \
              /usr/local/bin/corepack \
    && groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs --create-home nextjs \
    && mkdir -p /app/storage/uploads \
    && chown -R nextjs:nodejs /app

# Copy standalone build artifacts from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
