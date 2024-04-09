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

## `ThreeJS React`

- Установка.

    ```
    npx create-react-app three-react --template typescript
    npm install --save-dev --save-exact prettier
    npm install three @react-three/fiber
    npm install @types/three --save-dev
    npm install @react-three/drei --save-dev
    npm install r3f-perf --save-dev
    npm install leva --save-dev
    gltfjsx@6.2.16
    npm install three-stdlib
    npm install @tweenjs/tween.js
    npm install dat.gui --save-dev
    npm install @types/dat.gui --save-dev
    npm i zustand
    npm i @react-three/postprocessing
    npm i @react-three/cannon
    ```

## `Admin / Tester`

- Установка.

    ```
    nest new admin-tester
    npm i @nestjs/mongoose mongoose mongoose-autopopulate
    npm install --save @nestjs/typeorm typeorm pg
    npm i --save @nestjs/config
    npm install --save nest-winston winston
    npm i winston-daily-rotate-file
    npm install nest-keycloak-connect keycloak-connect --save
    npm i @keycloak/keycloak-admin-client
    npm i @adminjs/nestjs adminjs
    npm i @adminjs/typeorm
    npm i @adminjs/mongoose
    npm i @adminjs/express
    npm install dotenv --save
    npm i @s3pweb/keycloak-admin-client-cjs
    npm i lodash
    npm i @types/lodash
    npm i typeorm-extension
    npm install ts-node --save-dev
    npm i react-router
    npm i styled-components
    npm install --save @types/styled-components
    npm i react-dom
    npm i react-router-dom
    npm install --save @nestjs/serve-static
    npm install multer @types/multer
    npm install mime-types @types/mime-types
    npm i axios
    npm i @nestjs/microservices@9.4.3
    npm i amqplib amqp-connection-manager
    ```

- Запуск.

    - `keyclock`
        ```
        $ kc.bat start-dev
        http://localhost:8080/admin/master/console
        ```
    - `adminjs`
        ```
        http://localhost:${PORT}/admin
        ADMINJS_EMAIL
        ADMINJS_PASSWORD
        ```

## `Client React/Redux`

- Установка.

    ```
    npx create-react-app client-redux --template cra-template-redux-typescript
    npm i @redux-devtools/extension
    npm i axios
    npm i @tanstack/react-query
    npm i notistack
    npm i @mui/material
    npm i react-router-dom
    npm i @emotion/react
    npm i @emotion/styled
    npm i node-sass
    npm i env-cmd
    ```

## `Static Server` for `Client React/Redux`

- Установка.

    ```
    nest new client-redux-server
    npm i @nestjs/config
    npm i nest-winston winston
    npm i @nestjs/serve-static
    ```

## `Client ThreeJS`

- Установка.

    ```
    npx create-react-app client-three --template typescript
    npm i three @react-three/fiber
    npm i @types/three --save-dev
    npm i @react-three/drei --save-dev
    npm i r3f-perf --save-dev
    npm i leva --save-dev
    ```

## `Static Server` for `Client ThreeJS`

- Установка.

    ```
    nest new client-three-server
    npm i @nestjs/config
    npm i nest-winston winston
    npm i @nestjs/serve-static
    ```

## `Authorization Server`

- Установка.

    ```
    nest new server-auth
    npm i --save @nestjs/config
    npm install nest-keycloak-connect keycloak-connect --save
    npm install --save nest-winston winston
    npm i @nestjs/axios
    npm install --save @nestjs/serve-static
    npm i moment
    npm i winston-daily-rotate-file
    npm i @s3pweb/keycloak-admin-client-cjs
    npm i dotenv
    ```

- Запуск `keyclock`.

    ```
    # start keycloak server
    $ kc.bat start-dev
    # start keycloak server with cache disabled
    $ kc.bat start-dev --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false
    ```

## `React Component Library`

- Установка.

    ```
    npx create-react-app react-library --template typescript
    npm i node-sass
    npm i react-router-dom
    ```

## `Server GraphQL API`

- Установка.

    ```
    npm install -g @nestjs/cli
    nest new server-graphql
    npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
    npm i graphql-ws graphql-subscriptions graphql-query-complexity
    npm i @nestjs/sequelize sequelize sequelize-typescript pg
    npm i --save-dev @types/sequelize
    npm i @nestjs/config
    npm i nest-winston winston
    npm i class-validator
    npm i nestjs-graphql-tools
    npm i @nestjs/microservices
    npm i amqplib amqp-connection-manager
    ```

## `Server REST API`

- Установка.

    ```
    nest new server-rest
    npm i @nestjs/mongoose mongoose mongoose-autopopulate
    npm i @nestjs/config
    npm i nest-winston winston
    npm i @nestjs/microservices
    npm i amqplib amqp-connection-manager
    npm i ioredis
    ```

## `Server RabbitMQ Database Monitoring`

- Установка.

    ```
    nest new monitor-rabbit
    npm i @nestjs/config
    npm i nest-winston winston
    npm i @nestjs/microservices
    npm i amqplib amqp-connection-manager
    npm i @nestjs/typeorm typeorm pg
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

### Task 6

- Добавить проект клиента `Three.js`.

### Task 7

- Добавить проект администратора `Admin / Tester`.
    - `postgres/typeorm`
    - `mongo/mongoose`
    - `AdminJS`
    - `Keycloak`

### Task 8

- `Admin / Tester` \
    Перенести `AdminJS` и `Keycloak` на `CommonJS`.

    - `AdminJS` понизить до версии 6.
    - Для `Keycloak` установить `@s3pweb/keycloak-admin-client-cjs`.

### Task 9

- `Admin / Tester`

    - Скрипты для создания, удаления, заполнения базы данных `postgres`.
    - Классы сущностей.

### Task 10

- `Admin / Tester`

    - `REST API`

### Task 11

- `Admin / Tester`

    - Тесты `e2e`.

### Task 12

- `Admin / Tester`

    - Модульные тесты.

### Task 13

- `Admin / Tester`

    - Компоненты редактирования ресурсов. 
    - Ресурсы для тестирования.
        ```
        public
            photos
                logo-small.jpg
            videos
                tom.mp4
        ```

### Task 14 

- Добавить проект клиента `client-redux`.

### Task 15

- Добавить проект сервера аутентификации `server-auth`.

### Task 16

- Добавить проект библиотеки компонентов.

### Task 17

- Аутентификация пользователя.

    - Формы входа и регистрации.
    - Скрипты для переноса библиотеки компонентов.
    - Настройка сервера `Keycloak 18`.

### Task 18

- Добавить проект `REST API`.

### Task 19

- Добавить проект `GraphQL API`.

### Task 20

- Добавить проект `RabbitMQ Database Monitoring`.

- Мониторинг запросов в следующих проектах:
    - `Admin / Tester`
    - `Server GraphQL API`
    - `Server REST API`

### Task 21

- Добавить кеширование `Redis` в проект `REST API`.

### Task 22

- Добавить проекты:
    - `Static Server` for `Client React/Redux`
    - `Client ThreeJS`
    - `Static Server` for `Client ThreeJS`

### Task 23

- Файлы конфигурации `.env.development`.

### Task 24

- Примеры `ThreeJS`.
