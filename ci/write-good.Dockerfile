FROM node:alpine

WORKDIR /home/node
RUN ["npm", "install", "-g", "write-good"]

# Directories to run the linter over
VOLUME /var/src

WORKDIR /var/src
ENTRYPOINT exec write-good *.md