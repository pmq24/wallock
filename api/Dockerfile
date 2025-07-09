FROM golang:1.24.4-bookworm AS base

RUN mkdir /app/
WORKDIR /app/

COPY ./go.mod ./go.sum ./
RUN go mod download

COPY ./ ./



FROM golang:1.24.4-bookworm AS dev

WORKDIR /app/
COPY --from=base /app/ ./

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/secrets/wallock-355309-e92f2650733f.json
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

ENTRYPOINT go run .



FROM golang:1.24.4-bookworm AS prod

WORKDIR /app/
COPY --from=base /app/ ./

ENV GEMINI_API_KEY=${GEMINI_API_KEY}

ENTRYPOINT go run .
