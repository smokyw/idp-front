FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY idp-box /app
WORKDIR /app
RUN mv .env.example .env

FROM base AS build
RUN pnpm install --prod
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.23-alpine

WORKDIR /app

COPY idp-box/docker/stand/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 idp-box/docker/20-envsubst-idp.sh /docker-entrypoint.d
COPY --chown=101:101 --from=build /app/.output/public /app/
