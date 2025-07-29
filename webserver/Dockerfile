FROM caddy:2.10.0-alpine

RUN mkdir /app/
WORKDIR /app/
COPY ./Caddyfile ./

EXPOSE 443/tcp
ENTRYPOINT caddy run --watch
