# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend

WORKDIR /src/frontend

COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM golang:1.23-alpine AS build

ENV GOTOOLCHAIN=auto

RUN apk add --no-cache ca-certificates

WORKDIR /src

COPY backend/go.mod ./
RUN go mod download

COPY backend/ ./
COPY --from=frontend /src/backend/static ./static/

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /suchi .

FROM alpine:3.20

RUN apk add --no-cache ca-certificates \
	&& adduser -D -H -u 65532 suchi

WORKDIR /

COPY --from=build /suchi /suchi

ENV SUCHI_DATA_ROOT=/data \
	SUCHI_ADDR=:8080

EXPOSE 8080

USER suchi

ENTRYPOINT ["/suchi"]
