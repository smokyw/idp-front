FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY idp-box /app
WORKDIR /app

FROM base AS build
RUN pnpm install --prod
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.23-alpine

WORKDIR /app

COPY idp-box/docker/stand/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /app/

