FROM node:latest

WORKDIR /home/node
RUN ["npm", "install", "-g", "spellchecker-cli"]

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]