# REST API

## `EnemyController`

Таблицы: `enemies`, `player_properties`, `inventory`, `inventory_products`, \
`products`, `enemy_skills`, `skills`.

- `insert` - `admin`

    - `level_template_id` - начальные параметры, инвентарь, скилы;
    - `delta_properties`, `products`, `skills` - изменения относительно \
        шаблона;

    ```typescript
    { 
        nickname,
        level_template_id,
        enemy_type,
        delta_properties,
        products: {
            add: [{ product_id, count_in_slots }],
            remove: [{ product_id, count_in_slots }]
        },
        skills: {
            add: [{ skill_id }],
            remove: [{ skill_id }]
        }
    }
    { enemy_id }
    ```

- `update` - `admin`

    - `reset_template_id` заменяет шаблон, сбрасывает параметры, инвентарь и \
        скилы к шаблонным настройкам;
    - `delta_properties`, `products`, `skills` изменения относительно нового \
        шаблона (если задать `reset_template_id`) или ранее установленных \
        значений;

    ```typescript
    {
        nickname,
        reset_template_id,
        enemy_type,
        delta_properties: {...},
        products: {
            add: [{ product_id, count_in_slots }],
            remove: [{ product_id, count_in_slots }]
        },
        skills: {
            add: [{ skill_id }],
            remove: [{ skill_id }]
        }
    }
    { enemy_id }
    ```

- `delete` - `admin`

    - каскадное удаление: `inventory`, `inventory_products`;

    ```typescript
    { enemy_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { enemy_id }
    { 
        id,
        nickname,
        enemy_type,
        inventory: {
            sorting,
            products: [
                { count_in_slot, title, price, max_in_slot, requirement_id }
            ],
        };
        properties: {...},
        template: { title },
        skills: [{ skill_id }];
    ```

- `list` - `user`

    ```typescript
    { }
    { enemies: [{ id, nickname}] }
    ```

## `GameController`

Таблицы: `games`, `game_players`, `spawn_scripts`, `spawn_scripts_enemies`, 

- `insert` - `user`

    - `owner_player_id` - идентификатор игрока, который создает игру;
    - игрок может создать и владеть только одной игрой;

    ```typescript
    { map_id, spawn_script_id, owner_player_id }
    { game_id }
    ```

- `update` - `user`

    - `to_connect` подключает указанного игрока к игре;
    - владелец игры не может выйти из игры, но может ее удалить;

    ```typescript
    { player_id, to_connect }
    { insert/delete }
    ```

- `delete` - `user`

    - каскадное удаление: `game_players`;

    ```typescript
    { game_id, owner_player_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { game_id }
    { id, map_id, spawn_script_id, players: [{ id, login }] }
    ```

- `list` - `user`

    ```typescript
    { }
    { games: [{ id, map_title, players_count, enemies_count }] }
    ```

## `LevelTemplateController`

Таблицы: `level_templates`, `player_properties`, `skills`, `level_template_skills`.

- `insert` - `admin`

    ```typescript
    { 
        title, 
        properties: {...}, 
        products: [{ product_id, count_in_slots }],
        skills: [{ skill_id }],
    }
    { template_id }
    ```

- `update` - `admin`

    ```typescript
    { 
        template_id, 
        title, 
        delta_properties: {...}, 
        products: {
            add: [{ product_id, count_in_slots }],
            remove: [{ product_id, count_in_slots }]
        },
        skills: {
            add: [{ skill_id }],
            remove: [{ skill_id }]
        }
    }
    { template_id }
    ```

- `delete` - `admin`

    ```typescript
    { template_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { template_id }
    { 
        id, title, coins,
        properties: {...}, 
        inventory: [{...}], 
        skills:[{ id }] 
    }
    ```

- `list` - `user`

    ```typescript
    { }
    { templates: [{ id, title }] }
    ```

## `MapController`

Таблицы: `maps`, `map_points`, `activity_points`.

- `insert` - `admin`

    ```typescript
    { scene_id, title, all_poins: [{ position }] }
    { map_id }
    ```
    
- `update` - `admin`

    ```typescript
    { 
        map_id, title, 
        points: [{ point_id, position, type, ...props }] 
    }
    { map_id }
    ```

- `delete` - `admin`

    ```typescript
    { map_id }
    { rows }
    ```

- `select` - `user` + `admin`

    - `user` получает только установленные точки;
    - `admin` получает все точки, поле `point` может быть пустым

    ```typescript
    { map_id }
    { 
        id, title, 
        points: [{ id, position, type, ...props }], 
    }
    ```

- `list` - `user`

    ```typescript
    { }
    { maps: [{ id, title }] }
    ```

## `PlayerController`

Таблицы: `players`, `player_properties`, `inventory`, `inventory_products`, \
`products`, `level_effects`, `player_skills`, `skills`.

- `insert` - `user`

    - `level_template_id` - начальные параметры, инвентарь, скилы;
    - `delta_properties`, `products`, `skills` - изменения относительно \
        шаблона;

    ```typescript
    { 
        login, password,
        firstname, secondname, thirdname,
        email,
        level_template_id, 
        delta_properties: {...}, 
        products: {
            add: [{ product_id, count_in_slots }],
            remove: [{ product_id, count_in_slots }]
        },
        skills: {
            add: [{ skill_id }],
            remove: [{ skill_id }]
        },
        effects: [{ 
            count_matches, is_equipment, property_column, delta_value 
        }]
    }
    { player_id }
    ```

- `update` - `user`

    ```typescript
    { 
        player_id, 
        firstname, secondname, thirdname, email,
        delta_properties: {...}, 
        products: {
            buy: [{ product_id, count_in_slots }], 
            sell: [{ product_id, count_in_slots }],
        },
        skills:[{ skill_id }],
        effects: {
            add: [{ count_matches, is_equipment, property_column, delta_value }]
            remove: number[]
        }
    }
    { player_id }
    ```

- `delete` - `user`

    - каскадом удаляются inventory, inventory_products

    ```typescript
    { player_id }
    { rows }
    ```

- `select` - `user`

    - можно получать подробно только своих персонажей

    ```typescript
    { player_id }
    { 
        id, login, 
        properties: {...}, 
        inventory: {
            sorting,
            products: [{
                count_in_slot,
                title,
                price,
                max_in_slot,
                requirement_id,
            }],
        },
        skills: [{ id }],
        effects: [{
            id,
            count_matches,
            is_equipment,
            property_column,
            delta_value,
        }],
    }
    ```

- `list` - `user`

    ```typescript
    { }
    { id, login }
    ```

## `ProductController`

Таблицы: `products`, `product_skills`, `product_shells`, `product_weapons`, \
`product_clothes`, `weapon_shells`, `requirements`.

- `insert` - `admin`

    - `type` указывает на тип продукта: `product_shells`, `product_weapons`, \
        `product_clothes`;
    - `props` содержит уникальные параметры;

    ```typescript
    { 
        title, price, max_in_slot, 
        requirements: {...}, 
        // props: { ..., weapons: [ids] | shells: [ids]}, 
        skills: [{ skill_id }],
        type,
    }
    { product_id }
    ```

- `update` - `admin`

    ```typescript
    { 
        product_id, title, price, max_in_slot, 
        requirements: {...}, 
        // props: { ..., weapons: [ids] | shells: [ids]}, 
        skills:[{ skill_id }], 
        type, 
    }
    { product_id }
    ```

- `delete` - `admin`

    - каскадное удаление: `product_shells`, `product_weapons`, \
        `product_clothes`

    ```typescript
    { product_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { product_id }
    { 
        id, title, price, max_in_slot,
        requirements, 
        // props: {...}, 
        skills:[{ skill_id }],
        type,
    }
    ```

- `list` - `user`

    ```typescript
    {  }
    { id, title }
    ```

## `SkillController`

Таблицы: `skills`, `requirements`.

- `insert` - `admin`

    ```typescript
    { title, parent_skill_id, requrement: {...} }
    { skill_id }
    ```

- `update` - `admin`

    ```typescript
    { skill_id, title, parent_skill_id, requrement: {...} }
    { skill_id }
    ```

- `delete` - `admin`

    ```typescript
    { skill_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { skill_id }
    { id, title, parent_skill_id, requrement: {...} }
    ```

- `list` - `user`

    ```typescript
    { }
    { skills: [{ skill_id, parent_skill_id, title }] }
    ```

## `SpawnController`

Таблицы: `spawn_scripts`, `spawn_script_enemies`, `enemies`, `inventory`, \
`inventory_products`, `products`, `player_properties`.

- `insert` - `admin`

    ```typescript
    { title, waves: [{ count, spawn, enemy_id }] }
    { spawn_id }
    ```

- `update` - `admin`

    - отправка полного списка волн: 
        - если `id` отсутствует, то добавляется новая запись;
        - если запись отсутствует в новом списке, то она удаляется;
        - если имеется `id`, то старая запись обновляется;

    ```typescript
    { spawn_id, waves: [{ id, count, spawn, enemy_id }] }
    { spawn_id }
    ```

- `delete` - `admin`

    - каскадное удаление: `spawn_script_enemies`;

    ```typescript
    { spawn_id }
    { rows }
    ```

- `select` - `user`

    ```typescript
    { spawn_id }
    { 
        id, title, waves: [{ 
            id, count, spawn, enemy_id
        }] 
    }
    ```

- `list` - `user`

    ```typescript
    { }
    { spawn_scripts: [{ id, title }] }
    ```
