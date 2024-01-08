# Microservice Architecture

## `Mongo GraphQL Mongoose`

- Установка.

    ```
    nest new mongo-graphql-mongoose
    npm i @nestjs/mongoose mongoose mongoose-autopopulate
    npm i --save @nestjs/config
    npm install --save nest-winston winston
    npm i winston-daily-rotate-file
    npm i moment
    ```

## `Mongo REST API Mongoose`

- Установка.

    ```
    nest new mongo-rest-mongoose
    npm i @nestjs/mongoose mongoose mongoose-autopopulate
    npm i --save @nestjs/config
    npm install --save nest-winston winston
    ```

## `Postgres GraphQL TypeORM`

- Установка.

    ```
    nest new postgres-graphql-typeorm
    npm install --save @nestjs/typeorm typeorm pg
    npm i js-yaml
    npm i -D @types/js-yaml
    npm i winston-transport
    npm install --save nest-winston winston
    ```

## `Postgres REST API Sequelize`

- Установка.

    ```
    nest new postgres-rest-sequelize
    npm install --save @nestjs/sequelize sequelize sequelize-typescript pg
    npm install --save-dev @types/sequelize
    npm i --save @nestjs/config
    npm install --save nest-winston winston
    ```

## Run

- Запуск проектов `NestJS`.

    ```
    npm run format
    npm run start
    ```

## Settings

- `Prettier` по умолчанию для всех пакетов.

    ```
    "singleQuote": true,
    "trailingComma": "all",
    "tabWidth": 4
    ```

## Tasks

### Task 1

- Добавить проекты для работы с базами данных.

    - `Mongo GraphQL Mongoose` \
        Подготовить `Mongoose` для доступа к `MongoDB`.

    - `Mongo REST API Mongoose` \
        Подготовить `Mongoose` для доступа к `MongoDB`.

    - `Postgres GraphQL TypeORM` \
        Подготовить `TypeORM` для доступа к `PostgreSQL`.

    - `Postgres REST API Sequelize` \
        Подготовить `Sequelize` для доступа к `PostgreSQL`.

### Task 2

- Добавить конфигурацию.

    - `Mongo GraphQL Mongoose` \
        Из файла `.env`.

    - `Mongo REST API Mongoose` \
        С помощью `registerAs`.

    - `Postgres GraphQL TypeORM` \
        Из файла `yaml`.

    - `Postgres REST API Sequelize` \
        Из файла `ts`.

### Task 3

- Добавить логирование.

    - `Mongo GraphQL Mongoose` \
        Логирование в файлы с помощью `WinstonModule` и `DailyRotateFile`. \
        Кастомное логирование в консоль.

    - `Mongo REST API Mongoose` \
        Глобальная настройка логера в функции `bootstrap`.

    - `Postgres GraphQL TypeORM` \
        Логирование в базу данных `Postgres`.

    - `Postgres REST API Sequelize` \
        Логирование через провайдер `WINSTON_MODULE_NEST_PROVIDER`.
