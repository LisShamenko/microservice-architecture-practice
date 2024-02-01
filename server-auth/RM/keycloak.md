# `Keycloak`

## [Установка `keycloak`.](https://www.keycloak.org/getting-started/getting-started-zip)

- Установить `OpenJDK 20`.
- [Скачать keycloak.](https://github.com/keycloak/keycloak/releases/download/18.0.0/keycloak-18.0.0.zip)
- Распаковать на диск `C`.
- Установить переменные среды:
    ```
    JAVA_HOME
    C:\Program Files\Java\jdk-20
    path
    C:\keycloak-18.0.0\bin
    ```
- Запуск.
    ```
    # start keycloak server
    $ kc.bat start-dev
    # start keycloak server with cache disabled
    $ kc.bat start-dev --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false
    ```
- Консоль администратора по адресу `http://localhost:8080`.
    ```
        Administration Console
    Please create an initial admin user to get started.

    Username              | <имя пользователя> | admin
    Password              | <пароль>           | admin
    Password confirmation | <пароль>           | admin
    ```
- Создать дочерний `realm`.
    ```
    Create realm

    Resource file         | Drag a file here or browse to upload
    Realm name *          | nest-realm
    Enabled               | On
    ```
- `Realm settings`.
    ```
    Tokens
    Access Token Lifespan | 5 | Minutes

    Sessions
    SSO Session Idle | 30 | Minutes
    ```
- Создать клиента для `backend-приложения`.
    ```
    Create client

    Client type           | OpenID Connect
    Client ID *           | nest-app
    Name                  | <>
    Description           | <>
    Always display in UI  | Off
    ```
- `Client settings`
    ```
    Access Type | bearer-only
        or
    Access Type | confidential
    ```
- Создать роли для `nest-app`.
    ```
    Role name       Composite       Description
    admin           False           Client admin role.
    user            False           Client user role.
    ```
- Создать роли для `realm`.
    ```
    Role name       Composite       Description
    app-admin       False           Realm role admin.
    app-user        False           Realm user admin.
    ```
- Aссоциировать роли: `app-admin` с `admin`, `app-user` с `user`.
    ```
    Associated roles
    app-admin       nest-app (admin)
    app-user        nest-app (user)
    ```
- Создать пользователей, установить каждому пароль (`Credentials`) и роли \
    (`Role Mapping`).

    | Имя     | Роли                    | Пароль   |
    |---------|-------------------------|----------|
    | `User1` | `app-user`              | `user_1` |
    | `User2` | `app-admin`             | `user_2` |
    | `User3` | `app-user`, `app-admin` | `user_3` |

- Создать группу `g1` и добавить в неё пользователей.
- Добавить атрибут `phone:123` одному из пользователей.
- Скопировать `Secret` в настройках клиента `Client settings -> Credentials`.
    ```
    Client Authenticator        Client Id and Secret
    Secret                      4rf4Xn0ZWAdr4vyIlmcv4W1b17Ew5n88
    ```

## Страница входа.

- Архив `keycloak-18.0.0/lib/lib/main/org.keycloak.keycloak-themes-18.0.0.jar` \
    содержит файлы клиента.

- Заменить страницу `login.ftl`, чтобы запрос на аутентификацию выдавал не форму \
    входа, а `url-адрес` на который эта форма отправляется.

    ```
    {
        "loginAction": "${url.loginAction}"
    }
    ```

- Содержимое `keycloak_themes` поместить в директорию `keycloak-18.0.0\themes`.
- `Realm settings -> Themes`, переключить `Login Theme` в `citizen-network`. 
