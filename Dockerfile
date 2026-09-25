# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend

WORKDIR /src/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM golang:alpine AS build

ENV GOTOOLCHAIN=auto

RUN apk add --no-cache ca-certificates \
	&& addgroup -g 65532 suchi \
	&& adduser -D -H -u 65532 -G suchi suchi \
	&& mkdir -p /data \
	&& chown -R 65532:65532 /data

WORKDIR /src

COPY backend/go.mod ./
RUN go mod download

COPY backend/ ./
COPY --from=frontend /src/backend/static ./static/

RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /suchi .

FROM scratch

# Copy TLS certificates & nonroot user configuration
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /etc/passwd /etc/passwd
COPY --from=build /etc/group /etc/group
COPY --from=build --chown=65532:65532 /data /data

# Copy single standalone binary
COPY --from=build /suchi /suchi

ENV SUCHI_DATA_ROOT=/data \
	SUCHI_ADDR=:8080

EXPOSE 8080

USER suchi:suchi

ENTRYPOINT ["/suchi"]
