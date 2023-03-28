# ABC TodoList CMS (NestJS + Postgres)

## Description

Simple Todo List Project from ABC Software Company.

## Framework and database

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

[Postgres](https://www.postgresql.org/) database

## Running Postgres Server

```bash
$ docker-compose up -d
```

## Installation

```bash
$ yarn
```

## Running the NestJS Server

```bash
# development with watch mode
$ yarn start:dev

# Stage mode: Comming soon

# production mode: Comming soon

```

## Migration To Server

```bash
# For Stage Server
yarn typeorm  migration:generate ./src/migrations-stage/AddFeautureTaskSymbol -d ./src/configs/data-source.ts
# For Product Server
yarn typeorm  migration:generate ./src/migrations/AddFeautureTaskSymbol -d ./src/configs/data-source.ts
```
