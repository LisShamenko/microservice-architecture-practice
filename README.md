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

## `Client ThreeJS`

- Установка.

    ```
    npx create-react-app three-react --template typescript
    npm install --save-dev --save-exact prettier
    npm install three @react-three/fiber
    npm install @types/three --save-dev
    npm install @react-three/drei --save-dev
    npm install r3f-perf --save-dev
    npm install leva --save-dev
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
    ```

- Запуск.

    - `keyclock`
        ```
        $ kc.bat start-dev
        http://localhost:8080/admin/master/console
        ```
    - `adminjs`
        ```
        http://localhost:${port}/admin
        AJS_EMAIL
        AJS_PASSWORD
        ```

- Тестовая конфигурация.

    - `configs/.env`
        ```
        PORT=3001
        MONGO_URI=mongodb://localhost:27017/test
        PG_HOST=localhost
        PG_PORT=5432
        PG_USERNAME=postgres
        PG_PASSWORD=postgres
        PG_DATABASE=test_1
        AJS_EMAIL=a
        AJS_PASSWORD=a
        ADMIN_USERNAME=admin
        ADMIN_PASSWORD=admin
        ADMIN_GRANT_TYPE=password
        ADMIN_CLIENT_ID=admin-cli
        ADMIN_TOTP=123456
        ```
    - `configs/keycloak.env`
        ```
        KEY_URL=http://localhost:8080
        KEY_REALM=citizen-network
        KEY_CLIENT_ID=nest-app
        KEY_SECRET=4rf4Xn0ZWAdr4vyIlmcv4W1b17Ew5n88
        ```

## `client-redux`

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
    ```

## `server-auth`

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

## `react-library`

- Установка.

    ```
    npx create-react-app react-library --template typescript
    npm i node-sass
    npm i react-router-dom
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
