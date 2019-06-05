FROM leiserfg/zola:0.7.0

EXPOSE 1111

VOLUME /var/website
WORKDIR /var/website
ENTRYPOINT [ "/usr/bin/zola" ]