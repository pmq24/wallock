FROM caddy:2.10.0-alpine

RUN mkdir /app/
WORKDIR /app/
COPY ./Caddyfile ./

EXPOSE 3000/tcp
ENTRYPOINT caddy run --watch
