# TODOAPP

Dummy pet project where I mess around with hypebeast tech stack (like GraphQL,
NextJS, typeorm, redis, postgre, typedi, docker).

## Installation

1. Create .env in the project root(see Config example)
2. Run docker:

```
#!sh
docker-compose build
docker-compose up
```

## Config example

```
#!sh
REDIS_SECRET=secret123
AUTH_COOKIE_NAME=qid
SERVER_PORT=4000
DBNAME=todoapp
DBUSER=admin
DBPASSWORD=todoapp

```
