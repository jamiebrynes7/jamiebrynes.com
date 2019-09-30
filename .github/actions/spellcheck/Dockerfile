FROM node:alpine

WORKDIR /home/node
RUN ["npm", "install", "-g", "spellchecker-cli"]

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]