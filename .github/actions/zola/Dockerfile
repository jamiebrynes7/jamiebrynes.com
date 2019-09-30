FROM ubuntu:latest
ENV ZOLA_VERSION v0.7.0

WORKDIR /workdir
RUN apt-get update \
    && apt-get install -y curl tar \
    && apt-get clean \
    && curl -L https://github.com/getzola/zola/releases/download/$ZOLA_VERSION/zola-$ZOLA_VERSION-x86_64-unknown-linux-gnu.tar.gz | tar xz

RUN mv zola /usr/bin/zola

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]