# GraphQL API

## Enemy

```graphql
mutation AddEnemy {
    addEnemy(
        data: {
            nickname: "title 1"
            level_template_id: 1
            delta_properties: { 
                strength: 3, 
                intelligence: -2, 
                throwing: 90,
            }
            skills: { 
                add: [3], 
                remove: [1],
            }
            products: {
                add: [
                    { product_id: 2, count_in_slots: 10 }, 
                    { product_id: 3, count_in_slots: 1 },
                ]
                remove: [
                    { product_id: 1, count_in_slots: 1 },
                ]
            }
            enemy_type: Test
        }
    ) {
        id
    }
}

mutation ReplaceEnemy {
    updateEnemy(
        data: {
            enemy_id: 2
            nickname: "HelloWorld!"
            reset_template_id: 2
            delta_properties: { 
                strength: 5,
            }
            products: {
                add: [
                    { product_id: 1, count_in_slots: 50 }, 
                    { product_id: 2, count_in_slots: -10 },
                    { product_id: 3, count_in_slots: -10 },
                ],
                remove: [
                    { product_id: 1, count_in_slots: 100 },
                ]
            }
            skills: { 
                add: [3],
                remove: [1,2,3],
            }
        }
    ) {
        id
    }
}

mutation UpdateEnemy {
    updateEnemy(
        data: {
            enemy_id: 2
            nickname: "HelloWorld!"
            delta_properties: {
                strength: -5,
            }
            products: {
                add: [
                    { product_id: 1, count_in_slots: 50 },
                ]
            }
            skills: {
                add: [3],
            }
        }
    ) {
        id
    }
}

query GetEnemy {
    getEnemy(id: 1) {
        id
        enemy_type
        nickname
        inventory {
            id
            sorting
            inventoryProducts {
                id
                title
                price
                max_in_slot
                product_type
                count_in_all_slots
            }
        }
        properties {
            id,
            strength, endurance, intelligence,
            agility, fire_weapons, melee_weapons,
            throwing, doctor, sneak, steal,
            traps, science, repair, barter
        }
        template {
            id, title, coins
        }
        skills {
            id, title
        }
    }
}

query GetEnemies {
    getEnemies {
        id
        enemy_type
        nickname
        inventory {
            id, sorting
        }
        properties {
            id,
            strength, endurance, intelligence,
            agility, fire_weapons, melee_weapons,
            throwing, doctor, sneak, steal,
            traps, science, repair, barter
        }
        template {
            id, title, coins
        }
        skills {
            id, title
        }
    }
}

mutation RemoveEnemy {
    removeEnemy(id: 2) {
        rows
    }
}
```

## Game

```graphql
mutation AddGame {
    addGame(
        data: { 
            map_id: 1, 
            spawn_script_id: 1, 
            owner_player_id: 1,
        }
    ) {
        id
    }
}

mutation UpdateGame {
    updateGame(
        data: { 
            game_id: 2, 
            player_id: 2,
            to_connect: true, 
        }
    ) {
        result
    }
}

query GetGame {
    getGame(id: 1) {
        id
        map {
            id, title, scene_id
        }
        players {
            id, login, password, firstname, secondname, thirdname, email
        }
        ownerPlayer {
            id, login, password, firstname, secondname, thirdname, email
        }
        spawnScript {
            id, title
        }
    }
}

query GetGames {
    getGames {
        id
        map {
            id, title, scene_id
        }
        players {
            id, login, password, firstname, secondname, thirdname, email
        }
        ownerPlayer {
            id, login, password, firstname, secondname, thirdname, email
        }
        spawnScript {
            id, title
        }
    }
}

mutation RemoveGame {
    removeGame(id: 1) {
        rows
    }
}
```

## LevelTemplate

```graphql
mutation AddTemplate {
    addTemplate(
        data: {
            title: "test template"
            properties: { 
                strength: 17, endurance: 17, 
                intelligence: 17, agility: 17,
                fire_weapons: 17, melee_weapons: 17, 
                throwing: 17, doctor: 17,
                sneak: 17, steal: 17, traps: 17, 
                science: 17, repair: 17, barter: 17
            }
            products: [
                { product_id: 1, count_in_slots: 5 },
            ]
            skills: [1,2]
        }
    ) {
        id
    }
}

mutation UpdateTemplate {
    updateTemplate(
        data: {
            template_id: 5
            title: "test template II"
            delta_properties: {
                strength: -7, endurance: -7,
                intelligence: -7, agility: -7,
                fire_weapons: 17, melee_weapons: 17,
                throwing: 17, doctor: 17,
                sneak: 17, steal: 17, traps: 17,
                science: 17, repair: 17, barter: 17
            },
            products: {
                add: [
                    { product_id: 2, count_in_slots: 1 },
                ],
                remove: [
                    { product_id: 1, count_in_slots: 4 },
                ]
            },
            skills: {
                add: [3],
                remove: [1]
            }
        }
    ) {
        id
    }
}

query GetTemplate {
    getTemplate(id: 5) {
        id, title, coins,
        inventory {
            id, sorting
            inventoryProducts {
                id, title, price, max_in_slot,
                product_type, count_in_all_slots
            }
        }
        properties {
            id,
            strength, endurance, intelligence, agility, 
            fire_weapons, melee_weapons, throwing, doctor
            sneak, steal, traps, science, repair, barter
        }
        skills {
            id, title
        }
    }
}

query GetTemplates {
    getTemplates {
        id, title, coins,
        inventory {
            id, sorting
        }
        properties {
            id,
            strength, endurance, intelligence, agility, 
            fire_weapons, melee_weapons, throwing, doctor
            sneak, steal, traps, science, repair, barter
        }
        skills {
            id, title
        }
    }
}

mutation RemoveTemplate {
    removeTemplate(id: 5) {
        rows
    }
}
```

## Map

```graphql
mutation AddMap {
    addMap(
        newMapData: { 
            scene_id: 1
            title: "new map"
            poins: [
                { x: 0, y: 0, z: 1 },
                { x: 0, y: 0, z: 2 },
                { x: 0, y: 0, z: 3 },
            ]
        }
    ) {
        id
        title
        scene_id
    }
}

mutation UpdateMap {
    updateMap(
        newMapData: {
            map_id: 2
            title: "new map"
            points: [
                { 
                    point_id: 10, 
                    position: { x: 1, y: 1, z: 0 },
                    type: spawn,
                    spawn: {
                        is_player: true,
                        is_enemy: false
                    }
                },
                { 
                    point_id: 11, 
                    position: { x: 1, y: 1, z: 0 },
                    type: teleport,
                    teleport: {
                        next_activity_id: 1,
                        prev_activity_id: 3
                    }
                }
            ]
        }
    ) {
        id
        title
        scene_id
    }
}

query GetMap {
    getMap(id: 2) {
        id, title, scene_id
        points {
            point_id, activity_id, map_id, position, pointType
            teleport {
                id, activity_id, next_id, prev_id
            }
            spawn {
                id, activity_id, is_player, is_enemy
            }
        }
    }
}

query GetMaps {
    getMaps {
        id, title, scene_id
        points {
            point_id, activity_id, map_id, position, pointType
            teleport {
                id, activity_id, next_id, prev_id
            }
            spawn {
                id, activity_id, is_player, is_enemy
            }
        }
    }
}

mutation RemoveMap {
    removeMap(id: 2) {
        rows
    }
}
```

## Player

```graphql
query GetPlayer {
    getPlayer(id: 4) {
        id, login, password, 
        firstname, secondname, 
        thirdname, email, effects 
        {
            id, count_matches, is_equipment, 
            property_column, delta_value
        }
        skills {
            id, title
        }
        template {
            id, title, coins
        }
        properties {
            id,
            strength, endurance, intelligence, agility,
            fire_weapons, melee_weapons, throwing, doctor,
            sneak, steal, traps, science, repair, barter
        }
        inventory {
            id
            sorting
            inventoryProducts {
                id, title, price, max_in_slot, 
                product_type, count_in_all_slots
            }
        }
    }
}

query GetPlayers {
    getPlayers {
        id, login, password, 
        firstname, secondname, 
        thirdname, email, effects 
        {
            id, count_matches, is_equipment, 
            property_column, delta_value
        }
        skills {
            id, title
        }
        template {
            id, title, coins
        }
        properties {
            id,
            strength, endurance, intelligence, agility,
            fire_weapons, melee_weapons, throwing, doctor,
            sneak, steal, traps, science, repair, barter
        }
        inventory {
            id
            sorting
            inventoryProducts {
                id, title, price, max_in_slot, 
                product_type, count_in_all_slots
            }
        }
    }
}

mutation AddPlayer {
    addPlayer(
        data: {
            login: "second player",
            password: "123",
            firstname: "first",
            secondname: "second",
            thirdname: "third",
            email: "123@mail",
            level_template_id: 1,
            delta_properties: {
                strength: 1
            },
            products: {
                add: [
                    { product_id: 2, count_in_slots: 10 },
                    { product_id: 3, count_in_slots: 1 }
                ], 
                remove: [
                    { product_id: 1, count_in_slots: 1 }
                ]
            }, 
            skills: {
                add: [3],
                remove: [1]
            },
            effects: [
                {
                    count_matches: 3,
                    is_equipment: false,
                    property_column: strength,
                    delta_value: 3
                },
            ]
        }
    ) {
        id
    }
}

mutation UpdatePlayer {
    updatePlayer(
        data: { 
            player_id: 4
            firstname: "I"
            secondname: "II"
            thirdname: "III"
            email: "IIIIII@mail"
            delta_properties: {
                strength: 1,
            }
            products: {
                add: [
                    { product_id: 2, count_in_slots: 10 },
                    { product_id: 3, count_in_slots: 1 },
                ], 
                remove: [
                    { product_id: 1, count_in_slots: 1 },
                ]
            }
            skills: {
                add: [3],
                remove: [1],
            }
            add_effects: [
                {
                    count_matches: 1,
                    is_equipment: false,
                    property_column: strength,
                    delta_value: 1,
                }
            ]
            remove_effects: [2]
        }
    ) {
        id
    }
}

mutation RemovePlayer {
    removePlayer(id: 1) {
        rows
    }
}
```

## Product

```graphql
mutation AddProduct {
    addProduct(
        data: {
            title: "new product",
            price: 1000,
            max_in_slot: 50,
            type: cloth,
            requirement: {
                title: "ok",
                player_level: 1,
                strength: 1, endurance: 1, intelligence: 1, agility: 1,
                fire_weapons: 1, melee_weapons: 1, throwing: 1, doctor: 1,
                sneak: 1, steal: 1, traps: 1, science: 1, repair: 1, barter: 1,
            },
            skills: [1],
        }
    ) {
        id
    }
}

mutation UpdateProduct {
    updateProduct(
        data: {
            product_id: 4
            title: "new IV"
            price: 10
            max_in_slot: 5
            type: weapon
            requirement: {
                title: "ok", player_level: 10,
                strength: 10, endurance: 10, intelligence: 10, agility: 10,
                fire_weapons: 10, melee_weapons: 10, throwing: 10, doctor: 10,
                sneak: 10, steal: 10, traps: 10, science: 10, repair: 10, barter: 10,
            }
            skills: {
                add: [3],
                remove: [1],
            }
        }
    ) {
        id
    }
}

query GetProduct {
    getProduct(id: 4) {
        id, title, price, max_in_slot, product_type,
        requirement {
            id, title, player_level,
            strength, endurance, intelligence, agility,
            fire_weapons, melee_weapons, throwing, doctor,
            sneak, steal, traps, science, repair, barter
        }
        skills {
            id, title
        }
        productWeapon {
            id, product_id
        }
        productShell {
            id, product_id
        }
        productCloth {
            id, product_id
        }
    }
}

query GetProducts {
    getProducts {
        id, title, price, max_in_slot, product_type,
        requirement {
            id, title, player_level,
            strength, endurance, intelligence, agility,
            fire_weapons, melee_weapons, throwing, doctor,
            sneak, steal, traps, science, repair, barter
        }
        skills {
            id, title
        }
        productWeapon {
            id, product_id
        }
        productShell {
            id, product_id
        }
        productCloth {
            id, product_id
        }
    }
}

mutation RemoveProduct {
    removeProduct(id: 2) {
        rows
    }
}
```

## Skill

```graphql
mutation AddSkill {
    addSkill(
        data: { 
            title: "new product",
            parent_skill_id: 1,
            requirement: {
                title: "ok",
                player_level: 1,
                strength: 1, endurance: 1, intelligence: 1, agility: 1,
                fire_weapons: 1, melee_weapons: 1, throwing: 1, doctor: 1,
                sneak: 1, steal: 1, traps: 1, science: 1, repair: 1, barter: 1,
            }
        }
    ) {
        id
    }
}

mutation UpdateSkill {
    updateSkill(
        data: {
            skill_id: 4
            title: "IV",
            parent_skill_id: 2,
            requirement: {
                title: "ok", player_level: 5,
                strength: 5, endurance: 5, intelligence: 5, agility: 5,
                fire_weapons: 5, melee_weapons: 5, throwing: 5, doctor: 5, 
                sneak: 5, steal: 5, traps: 5, science: 5, repair: 5, barter: 5,
            }
        }
    ) {
        id
        title
    }
}

query GetSkill {
    getSkill(id: 4) {
        id, title
        childSkills { id, title }
        parentSkills { id, title }
        requirement {
            id, title, player_level,
            strength, endurance, intelligence,
            agility, fire_weapons, melee_weapons,
            throwing, doctor, sneak, steal,
            traps, science, repair, barter
        }
    }
}

query GetSkills {
    getSkills {
        id, title
        childSkills { id, title }
        parentSkills { id, title }
        requirement {
            id, title, player_level,
            strength, endurance, intelligence,
            agility, fire_weapons, melee_weapons,
            throwing, doctor, sneak, steal,
            traps, science, repair, barter
        }
    }
}

mutation RemoveSkill {
    removeSkill(id: 4) {
        rows
    }
}
```

## Spawn

```graphql
mutation AddSpawn {
    addSpawn(
        data: {
            title: "ddd"
            waves: [
                { count: 1, spawn_moment: 20, enemy_id: 1 },
                { count: 3, spawn_moment: 60, enemy_id: 1 },
                { count: 1, spawn_moment: 80, enemy_id: 1 },
            ]
        }
    ) {
        id
        title
    }
}

mutation UpdateSpawn {
    updateSpawn(
        data: {
            script_id: 2
            title: "spawn II"
            waves: [
                { count: 2, spawn_moment: 20, enemy_id: 1, id: 6 },
                { count: 1, spawn_moment: 30, enemy_id: 1 },
            ]
        }
    ) {
        id
        title
    }
}

query GetSpawn {
    getSpawn(id: 2) {
        id
        title
        waves {
            id
            count
            spawn_moment
            enemy_id
            enemies {
                id
                enemy_type
                nickname
            }
        }
    }
}

query GetSpawns {
    getSpawns {
        id
        title
        waves {
            id
            count
            spawn_moment
            enemy_id
            enemies {
                id
                enemy_type
                nickname
            }
        }
    }
}

mutation RemoveSpawn {
    removeSpawn(id: 2) {
        rows
    }
}
```
