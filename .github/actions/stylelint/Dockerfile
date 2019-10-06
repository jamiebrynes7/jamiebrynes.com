FROM node:alpine

WORKDIR /home/node
RUN npm install -g stylelint \
    && npm install -g stylelint-config-standard \
    && npm install -g stylelint-scss

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]