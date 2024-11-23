FROM rust:1.74-slim as builder

WORKDIR /usr/src/

COPY . .

RUN cargo build --release

FROM debian:bookworm-slim

WORKDIR /usr/app

COPY --from=builder /usr/src/frontend/dist /usr/app/frontend/dist
COPY --from=builder /usr/src/frontend/dist/index.html /usr/app/frontend/dist/index.html
COPY --from=builder /usr/src/config /usr/app/config
COPY --from=builder /usr/src/target/release/podcast_loco-cli /usr/app/podcast_loco-cli

RUN mkdir -p /usr/app/audio

ENTRYPOINT ["/usr/app/podcast_loco-cli"]