FROM node:16 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .


# prdocution
FROM base as production

RUN npm run build

