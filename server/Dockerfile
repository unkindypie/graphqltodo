FROM node:16 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .


# продакшн
FROM base as production

RUN npm run compile

# юнит/интегрейшн тесты
FROM base as unit-tests
# чтобы jest подхватил ченжи
ENV GIT_WORK_TREE=/home/node/app GIT_DIR=/home/node/.git

RUN apt-get update && \
    apt-get install git

