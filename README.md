# The Todoapp ©

Pet project where I mess around with hypebeast full tech stack (GraphQL,
NextJS, typeorm, redis, postgre, typedi, docker, integration testing with jest).

## Features:

Some things that I did here:

- SSR
- Code generation(of React hooks) from GraphQL schema
- Auth via http-only cookies with sessions stored in redis
- All in typescript
- DI and integration tests (in backend)
- All put inside docker (including tests in watch mode)

## Installation

1. Create .env in the project root(see Config example)
2. Run docker:

```
#!sh
docker-compose build
docker-compose up
```

## Development

Runs ts-node-dev and nextjs in watch mode inside docker.

```
#!sh
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up
```

## Testing

Creates separate test database, applies migrations and runs jest tests in watch mode.

```
#!sh
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml up
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
