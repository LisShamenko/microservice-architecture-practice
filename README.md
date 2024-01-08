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
    npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
    npm i --save class-validator class-transformer
    npm i graphql-ws
    npm i graphql-subscriptions
    npm i graphql-query-complexity
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

### Task 4 

- `Postgres GraphQL TypeORM` \
    Подключить `GraphQL`.

    ```
    curl -L -X POST "http://localhost:3000/graphql/" -H 'Content-Type: application/json' 
        --data-raw '{"query":"{ getUser(id: 1) { id firstname lastname isActive photos {id} }}"}'
    ```

### Task 5 

- `RM`
    - `C_01` - Использование `Docker` / `Docker Compose`.
    - `A_02` - Использование `psql`.
    - `A_03` - Конфигурирование сервера.
    - `A_04` - Общее устройство `PostgreSQL`.
    - `A_05` - Изоляция и многоверсионность.
    - `A_06` - Очистка.
    - `A_07` - Буферный кеш и журнал.
    - `A_08` - Базы данных и схемы.
    - `A_09` - Системный каталог.
    - `A_10` - Табличные пространства.
    - `A_11` - Низкий уровень.
    - `D_07` - Приложение `Book Store`.
    - `D_08` - Функции.
    - `D_09` - Процедуры.
    - `D_10` - Составные типы.
