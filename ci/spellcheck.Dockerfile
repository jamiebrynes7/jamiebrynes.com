FROM node:alpine

WORKDIR /home/node
RUN ["npm", "install", "-g", "spellchecker-cli"]

# Directories to run the linter over
VOLUME /var/src

WORKDIR /var/src