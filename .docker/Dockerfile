FROM golang:1.25.5-alpine AS builder
WORKDIR /src

# Install git for module fetching
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the CLI/binary from the cmd/api entry
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/zenfy ./cmd/api

FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/zenfy /usr/local/bin/zenfy
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/zenfy"]
