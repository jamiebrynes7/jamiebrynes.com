FROM node:alpine

WORKDIR /home/node
RUN ["npm", "install", "-g", "spellchecker-cli"]

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]