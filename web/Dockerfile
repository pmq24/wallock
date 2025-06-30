FROM node:24-alpine3.21 AS prepare

RUN mkdir /app/
WORKDIR /app/
COPY ./ ./
RUN npm clean-install



FROM node:24-alpine3.21 AS dev

WORKDIR /app/
COPY --from=prepare /app/ ./
ENTRYPOINT npm run dev



FROM node:24-alpine3.21 AS build

WORKDIR /app/
COPY --from=prepare /app/ ./
RUN npm run build



FROM caddy:2.10.0-alpine AS prod

WORKDIR /app/
COPY --from=build /app/dist/ ./dist/
COPY ./Caddyfile ./
ENTRYPOINT caddy run
