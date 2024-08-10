FROM node:22-alpine

ENV NODE_VERSION 22.6.0

WORKDIR /var/node/app

COPY package*.json ./

RUN npm ci

RUN npm build

EXPOSE 8080

CMD ["npm", "START"]
