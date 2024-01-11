# Queries

## Enemy

- `insert`

    ```json
    {
        "nickname": "second enemy",
        "level_template_id": 1,
        "enemy_type": "test",
        "delta_properties": {
            "strength": 3,
            "intelligence": -2,
            "throwing": 90
        },
        "products": {
            "add": [
                { "product_id": 2, "count_in_slots": 10 },
                { "product_id": 3, "count_in_slots": 1 }
            ], 
            "remove": [
                { "product_id": 1, "count_in_slots": 1 }
            ]
        }, 
        "skills": {
            "add": [3],
            "remove": [1]
        }
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "nickname": "second enemy",
        "enemy_type": "test",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 1,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5,
                },
                {
                    "count_in_slot": 15,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5,
                },
                {
                    "count_in_slot": 1,
                    "title": "меч",
                    "price": 1,
                    "max_in_slot": 1,
                    "requirement_id": 5,
                }
            ]
        },
        "properties": {
            "strength": 8,
            "endurance": 6,
            "intelligence": 2,
            "agility": 5,
            "fire_weapons": 14,
            "melee_weapons": 13,
            "throwing": 100,
            "doctor": 3,
            "sneak": 13,
            "steal": 3,
            "traps": 6,
            "science": 1,
            "repair": 3,
            "barter": 16,
        },
        "template": {
            "title": "юный боец на ногах"
        },
        "skills": [
            3
        ]
    }
    ```

- `select` 

    ```json
    {
        "id": 2,
        "nickname": "second enemy",
        "enemy_type": "test",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 1,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 15,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 1,
                    "title": "меч",
                    "price": 1,
                    "max_in_slot": 1,
                    "requirement_id": 5
                }
            ]
        },
        "properties": {
            "strength": 8,
            "endurance": 6,
            "intelligence": 2,
            "agility": 5,
            "fire_weapons": 14,
            "melee_weapons": 13,
            "throwing": 100,
            "doctor": 3,
            "sneak": 13,
            "steal": 3,
            "traps": 6,
            "science": 1,
            "repair": 3,
            "barter": 16
        },
        "template": {
            "title": "юный боец на ногах"
        },
        "skills": [
            3
        ]
    }
    ```

- `replace`

    ```json
    {
        "nickname": "HelloWorld!",
        "reset_template_id": 2,
        "delta_properties": {
            "strength": 5
        },
        "products": {
            "add": [
                { "product_id": 1, "count_in_slots": 50 }, 
                { "product_id": 2, "count_in_slots": -10 },
                { "product_id": 3, "count_in_slots": -10 }
            ],
            "remove": [
                { "product_id": 1, "count_in_slots": 100 }
            ]
        },
        "skills": {
            "add": [3],
            "remove": [1,2,3]
        }
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "nickname": "HelloWorld!",
        "enemy_type": "test",
        "inventory": {
            "sorting": "none",
            "products": []
        },
        "properties": {
            "strength": 10,
            "endurance": 7,
            "intelligence": 3,
            "agility": 6,
            "fire_weapons": 21,
            "melee_weapons": 49,
            "throwing": 38,
            "doctor": 6,
            "sneak": 30,
            "steal": 4,
            "traps": 8,
            "science": 4,
            "repair": 5,
            "barter": 49
        },
        "template": {
            "title": "опытный боец на ногах"
        },
        "skills": []
    }
    ```

- `update`

    ```json
    {
        "nickname": "HelloWorld!",
        "delta_properties": {
            "strength": -5
        },
        "products": {
            "add": [
                { "product_id": 1, "count_in_slots": 50 }
            ]
        },
        "skills": {
            "add": [3]
        }
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "nickname": "HelloWorld!",
        "enemy_type": "test",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 5,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5,
                }
            ]
        },
        "properties": {
            "strength": 5,
            "endurance": 7,
            "intelligence": 3,
            "agility": 6,
            "fire_weapons": 21,
            "melee_weapons": 49,
            "throwing": 38,
            "doctor": 6,
            "sneak": 30,
            "steal": 4,
            "traps": 8,
            "science": 4,
            "repair": 5,
            "barter": 49,
        },
        "template": {
            "title": "опытный боец на ногах"
        },
        "skills": [
            3
        ]
    }
    ```
    
- `list`

    ```json
    {
        "enemies": [
            {
                "id": 1,
                "nickname": "first enemy"
            },
            {
                "id": 2,
                "nickname": "HelloWorld!"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "enemies": [
            {
                "id": 1,
                "nickname": "first enemy"
            }
        ]
    }
    ```

## Game

- `insert`

    ```json
    { 
        "map_id": 1, 
        "spawn_script_id": 1,
        "owner_player_id": 1
    }
    {
        "id": 1
    }
    {
        "id": 1,
        "map_id": 1,
        "spawn_script_id": 1,
        "players": [
            {
                "id": 1,
                "login": "login"
            }
        ]
    }
    ```

    ```json
    { 
        "map_id": 1, 
        "spawn_script_id": 1,
        "owner_player_id": 1
    }
    {
        "error": "logical: the player has already created his own game"
    }
    ```

- `select` 

    ```json
    {
        "id": 1,
        "map_id": 1,
        "spawn_script_id": 1,
        "players": [
            {
                "id": 1,
                "login": "login"
            }
        ],
    }
    ```

- `update`

    ```json
    {
        "player_id": 2,
        "to_connect": true
    }
    {
        "insert_player": [
            {
                "id": 2
            }
        ]
    }
    {
        "id": 1,
        "map_id": 1,
        "spawn_script_id": 1,
        "players": [
            {
                "id": 1,
                "login": "login"
            },
            {
                "id": 2,
                "login": "log"
            }
        ],
        "playersCount": 2
    }
    ```
    
- `list`

    ```json
    {
        "games": [
            {
                "id": 1,
                "map_title": "первая карта",
                "players_count": 2,
                "enemies_count": 12
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "games": []
    }
    ```

## LevelTemplate

- `insert`

    ```json
    {
        "title": "test template",
        "properties": {
            "strength": 17,
            "endurance": 17,
            "intelligence": 17,
            "agility": 17,
            "fire_weapons": 17,
            "melee_weapons": 17,
            "throwing": 17,
            "doctor": 17,
            "sneak": 17,
            "steal": 17,
            "traps": 17,
            "science": 17,
            "repair": 17,
            "barter": 17
        },
        "products": [
            { "product_id": 1, "count_in_slots": 5 }
        ],
        "skills": [1,2]
    }
    {
        "id": 5
    }
    {
        "id": 5,
        "title": "test template",
        "coins": 0,
        "properties": {
            "strength": 10,
            "endurance": 10,
            "intelligence": 10,
            "agility": 10,
            "fire_weapons": 17,
            "melee_weapons": 17,
            "throwing": 17,
            "doctor": 17,
            "sneak": 17,
            "steal": 17,
            "traps": 17,
            "science": 17,
            "repair": 17,
            "barter": 17
        },
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 5,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5
                }
            ]
        },
        "skills": [
            1,
            2
        ]
    }
    ```

- `select` 

    ```json
    {
        "id": 5,
        "title": "test template",
        "coins": 0,
        "properties": {
            "strength": 10,
            "endurance": 10,
            "intelligence": 10,
            "agility": 10,
            "fire_weapons": 17,
            "melee_weapons": 17,
            "throwing": 17,
            "doctor": 17,
            "sneak": 17,
            "steal": 17,
            "traps": 17,
            "science": 17,
            "repair": 17,
            "barter": 17
        },
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 5,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5
                }
            ]
        },
        "skills": [
            1,
            2
        ]
    }
    ```

- `update`

    ```json
    {
        "title": "test template II",
        "delta_properties": {
            "strength": -7,
            "endurance": -7,
            "intelligence": -7,
            "agility": -7,
            "fire_weapons": 17,
            "melee_weapons": 17,
            "throwing": 17,
            "doctor": 17,
            "sneak": 17,
            "steal": 17,
            "traps": 17,
            "science": 17,
            "repair": 17,
            "barter": 17
        },
        "products": {
            "add": [{ "product_id": 2, "count_in_slots": 1 }],
            "remove": [{ "product_id": 1, "count_in_slots": 4 }]
        },
        "skills": {
            "add": [3],
            "remove": [1]
        }
    }
    {
        "id": 5
    }
    {
        "id": 5,
        "title": "test template II",
        "coins": 0,
        "properties": {
            "strength": 3,
            "endurance": 3,
            "intelligence": 3,
            "agility": 3,
            "fire_weapons": 34,
            "melee_weapons": 34,
            "throwing": 34,
            "doctor": 34,
            "sneak": 34,
            "steal": 34,
            "traps": 34,
            "science": 34,
            "repair": 34,
            "barter": 34
        },
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 1,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5,
                },
                {
                    "count_in_slot": 1,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5,
                }
            ]
        },
        "skills": [
            2,
            3
        ]
    }
    ```
    
- `list`

    ```json
    {
        "templates": [
            {
                "id": 1,
                "title": "юный боец на ногах"
            },
            {
                "id": 2,
                "title": "опытный боец на ногах"
            },
            {
                "id": 3,
                "title": "мастер боя на ногах"
            },
            {
                "id": 4,
                "title": "шаблон игрока"
            },
            {
                "id": 5,
                "title": "test template II"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "templates": [
            {
                "id": 1,
                "title": "юный боец на ногах"
            },
            {
                "id": 2,
                "title": "опытный боец на ногах"
            },
            {
                "id": 3,
                "title": "мастер боя на ногах"
            },
            {
                "id": 4,
                "title": "шаблон игрока"
            }
        ]
    }
    ```

## Map

- `insert`

    ```json
    {
        "scene_id": 1,
        "title": "new map",
        "all_poins": [
            { "x": 0, "y": 0, "z": 1 },
            { "x": 0, "y": 0, "z": 2 },
            { "x": 0, "y": 0, "z": 3 }
        ]
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "title": "new map",
        "points": [
            {
                "id": 10,
                "position": [
                    0,
                    0,
                    1
                ],
                "type": ""
            },
            {
                "id": 11,
                "position": [
                    0,
                    0,
                    2
                ],
                "type": ""
            },
            {
                "id": 12,
                "position": [
                    0,
                    0,
                    3
                ],
                "type": ""
            }
        ]
    }
    ```

- `select` 

    ```json
    {
        "id": 2,
        "title": "new map",
        "points": [
            {
                "id": 10,
                "position": [
                    0,
                    0,
                    1
                ],
                "type": ""
            },
            {
                "id": 11,
                "position": [
                    0,
                    0,
                    2
                ],
                "type": ""
            },
            {
                "id": 12,
                "position": [
                    0,
                    0,
                    3
                ],
                "type": ""
            }
        ]
    }
    ```

- `update`

    ```json
    {
        "title": "new map",
        "points": [
            { 
                "point_id": 10, 
                "position": {
                    "x": 1, "y": 1, "z": 0
                },
                "type": "spawn",
                "spawn": {
                    "is_player": true,
                    "is_enemy": false
                }
            },
            { 
                "point_id": 11, 
                "position": {
                    "x": 1, "y": 1, "z": 0
                },
                "type": "teleport",
                "teleport": {
                    "next_activity_id": 1,
                    "prev_activity_id": 3
                }
            }
        ]
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "title": "new map",
        "points": [
            {
                "id": 10,
                "position": [
                    1,
                    1,
                    0
                ],
                "type": "spawn",
                "spawn": {
                    "is_player": true,
                    "is_enemy": false,
                    "activity_id": 8
                }
            },
            {
                "id": 11,
                "position": [
                    1,
                    1,
                    0
                ],
                "type": "teleport",
                "teleport": {
                    "next_activity_id": 1,
                    "prev_activity_id": 3,
                    "activity_id": 9
                }
            }
        ]
    }
    ```
    
- `list`

    ```json
    {
        "maps": [
            {
                "id": 1,
                "title": "первая карта"
            },
            {
                "id": 2,
                "title": "new map"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "maps": [
            {
                "id": 1,
                "title": "первая карта"
            }
        ]
    }
    ```

## Player

- `insert`

    ```json
    {
        "login": "second player",
        "password": "123",
        "firstname": "first",
        "secondname": "second",
        "thirdname": "third",
        "email": "123@mail",
        "level_template_id": 1,
        "delta_properties": {
            "strength": 1
        },
        "products": {
            "add": [
                { "product_id": 2, "count_in_slots": 10 },
                { "product_id": 3, "count_in_slots": 1 }
            ], 
            "remove": [
                { "product_id": 1, "count_in_slots": 1 }
            ]
        }, 
        "skills": {
            "add": [3],
            "remove": [1]
        },
        "effects": [{
            "count_matches": 3,
            "is_equipment": false,
            "property_column": "strength",
            "delta_value": "3"
        }]
    }
    {
        "id": 3
    }
    {
        "id": 3,
        "login": "second player",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 1,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 15,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 1,
                    "title": "меч",
                    "price": 1,
                    "max_in_slot": 1,
                    "requirement_id": 5
                }
            ]
        },
        "properties": {
            "strength": 6,
            "endurance": 6,
            "intelligence": 4,
            "agility": 5,
            "fire_weapons": 14,
            "melee_weapons": 13,
            "throwing": 14,
            "doctor": 3,
            "sneak": 13,
            "steal": 3,
            "traps": 6,
            "science": 1,
            "repair": 3,
            "barter": 16
        },
        "template": {
            "title": "юный боец на ногах"
        },
        "skills": [
            3
        ],
        "effects": [
            {
                "id": 2,
                "count_matches": 3,
                "is_equipment": false,
                "property_column": "strength",
                "delta_value": 3
            }
        ]
    }
    ```

- `select` 

    ```json
    {
        "id": 3,
        "login": "second player",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 1,
                    "title": "штаны пинателя",
                    "price": 1,
                    "max_in_slot": 5,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 15,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 1,
                    "title": "меч",
                    "price": 1,
                    "max_in_slot": 1,
                    "requirement_id": 5
                }
            ]
        },
        "properties": {
            "strength": 6,
            "endurance": 6,
            "intelligence": 4,
            "agility": 5,
            "fire_weapons": 14,
            "melee_weapons": 13,
            "throwing": 14,
            "doctor": 3,
            "sneak": 13,
            "steal": 3,
            "traps": 6,
            "science": 1,
            "repair": 3,
            "barter": 16
        },
        "template": {
            "title": "юный боец на ногах"
        },
        "skills": [
            3
        ],
        "effects": [
            {
                "id": 2,
                "count_matches": 3,
                "is_equipment": false,
                "property_column": "strength",
                "delta_value": 3
            }
        ]
    }
    ```

- `update`

    ```json
    {
        "firstname": "I",
        "secondname": "II",
        "thirdname": "III",
        "email": "IIIIII@mail",
        "delta_properties": {
            "strength": 1
        },
        "products": {
            "add": [
                { "product_id": 2, "count_in_slots": 10 },
                { "product_id": 3, "count_in_slots": 1 }
            ], 
            "remove": [
                { "product_id": 1, "count_in_slots": 1 }
            ]
        }, 
        "skills": {
            "add": [3],
            "remove": [1]
        },
        "effects": {
            "add": [{
                "count_matches": 1,
                "is_equipment": false,
                "property_column": "strength",
                "delta_value": "1"
            }],
            "remove": [2]
        }
    }
    {
        "id": 3
    }
    {
        "id": 3,
        "login": "second player",
        "inventory": {
            "sorting": "none",
            "products": [
                {
                    "count_in_slot": 25,
                    "title": "ракушки",
                    "price": 1,
                    "max_in_slot": 50,
                    "requirement_id": 5
                },
                {
                    "count_in_slot": 1,
                    "title": "меч",
                    "price": 1,
                    "max_in_slot": 1,
                    "requirement_id": 5
                }
            ]
        },
        "properties": {
            "strength": 7,
            "endurance": 6,
            "intelligence": 4,
            "agility": 5,
            "fire_weapons": 14,
            "melee_weapons": 13,
            "throwing": 14,
            "doctor": 3,
            "sneak": 13,
            "steal": 3,
            "traps": 6,
            "science": 1,
            "repair": 3,
            "barter": 16
        },
        "template": {
            "title": "юный боец на ногах"
        },
        "skills": [
            3
        ],
        "effects": [
            {
                "id": 3,
                "count_matches": 1,
                "is_equipment": false,
                "property_column": "strength",
                "delta_value": 1
            }
        ]
    }
    ```
    
- `list`

    ```json
    {
        "players": [
            {
                "id": 1,
                "login": "login"
            },
            {
                "id": 2,
                "login": "log"
            },
            {
                "id": 3,
                "login": "second player"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "players": [
            {
                "id": 1,
                "login": "login"
            },
            {
                "id": 2,
                "login": "log"
            }
        ]
    }
    ```

## Product

- `insert`

    ```json
    {
        "title": "new product",
        "price": 1000,
        "max_in_slot": 50,
        "requirement": {
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        },
        "skills": [1],
        "type": "cloth"
    }
    {
        "id": 4
    }
    {
        "id": 4,
        "title": "new product",
        "price": 1000,
        "max_in_slot": 50,
        "requirement": {
            "id": 6,
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        },
        "skills": [
            1
        ],
        "type": "cloth"
    }
    ```

- `select` 

    ```json
    {
        "id": 4,
        "title": "new product",
        "price": 1000,
        "max_in_slot": 50,
        "requirement": {
            "id": 6,
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        },
        "skills": [
            1
        ],
        "type": "cloth"
    }
    ```

- `update`

    ```json
    {
        "title": "new IV",
        "price": 10,
        "max_in_slot": 5,
        "requirement": {
            "title": "ok",
            "player_level": 10,
            "strength": 10,
            "endurance": 10,
            "intelligence": 10,
            "agility": 10,
            "fire_weapons": 10,
            "melee_weapons": 10,
            "throwing": 10,
            "doctor": 10,
            "sneak": 10,
            "steal": 10,
            "traps": 10,
            "science": 10,
            "repair": 10,
            "barter": 10
        },
        "skills": {
            "add": [3],
            "remove": [1]
        },
        "type": "weapon"
    }
    {
        "id": 4
    }
    {
        "id": 4,
        "title": "new IV",
        "price": 10,
        "max_in_slot": 5,
        "requirement": {
            "id": 6,
            "title": "ok",
            "player_level": 10,
            "strength": 10,
            "endurance": 10,
            "intelligence": 10,
            "agility": 10,
            "fire_weapons": 10,
            "melee_weapons": 10,
            "throwing": 10,
            "doctor": 10,
            "sneak": 10,
            "steal": 10,
            "traps": 10,
            "science": 10,
            "repair": 10,
            "barter": 10
        },
        "skills": [
            3
        ],
        "type": "weapon"
    }
    ```
    
- `list`

    ```json
    {
        "products": [
            {
                "id": 1,
                "title": "штаны пинателя"
            },
            {
                "id": 2,
                "title": "ракушки"
            },
            {
                "id": 3,
                "title": "меч"
            },
            {
                "id": 4,
                "title": "new IV"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "products": [
            {
                "id": 1,
                "title": "штаны пинателя"
            },
            {
                "id": 2,
                "title": "ракушки"
            },
            {
                "id": 3,
                "title": "меч"
            }
        ]
    }
    ```

## Skill

- `insert`

    ```json
    {
        "title": "new product",
        "parent_skill_id": 1,
        "requirement": {
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        }
    }
    {
        "id": 4
    }
    {
        "id": 4,
        "title": "new product",
        "parent_id": 1,
        "requirement": {
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        }
    }
    ```

- `select` 

    ```json
    {
        "id": 4,
        "title": "new product",
        "parent_id": 1,
        "requirement": {
            "title": "ok",
            "player_level": 1,
            "strength": 1,
            "endurance": 1,
            "intelligence": 1,
            "agility": 1,
            "fire_weapons": 1,
            "melee_weapons": 1,
            "throwing": 1,
            "doctor": 1,
            "sneak": 1,
            "steal": 1,
            "traps": 1,
            "science": 1,
            "repair": 1,
            "barter": 1
        }
    }
    ```

- `update`

    ```json
    {
        "title": "IV",
        "parent_skill_id": 2,
        "requirement": {
            "title": "ok",
            "player_level": 5,
            "strength": 5,
            "endurance": 5,
            "intelligence": 5,
            "agility": 5,
            "fire_weapons": 5,
            "melee_weapons": 5,
            "throwing": 5,
            "doctor": 5,
            "sneak": 5,
            "steal": 5,
            "traps": 5,
            "science": 5,
            "repair": 5,
            "barter": 5
        }
    }
    {
        "id": 4
    }
    {
        "id": 4,
        "title": "IV",
        "parent_id": 2,
        "requirement": {
            "title": "ok",
            "player_level": 5,
            "strength": 5,
            "endurance": 5,
            "intelligence": 5,
            "agility": 5,
            "fire_weapons": 5,
            "melee_weapons": 5,
            "throwing": 5,
            "doctor": 5,
            "sneak": 5,
            "steal": 5,
            "traps": 5,
            "science": 5,
            "repair": 5,
            "barter": 5
        }
    }
    ```
    
- `list`

    ```json
    {
        "skills": [
            {
                "id": 1,
                "title": "удар",
                "parent_id": null
            },
            {
                "id": 2,
                "title": "удар в прыжке",
                "parent_id": 1
            },
            {
                "id": 3,
                "title": "удар в двойном прыжке",
                "parent_id": 2
            },
            {
                "id": 4,
                "title": "IV",
                "parent_id": 2
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "skills": [
            {
                "id": 1,
                "title": "удар",
                "parent_id": null
            },
            {
                "id": 2,
                "title": "удар в прыжке",
                "parent_id": 1
            },
            {
                "id": 3,
                "title": "удар в двойном прыжке",
                "parent_id": 2
            }
        ]
    }
    ```

## SpawnScript

- `insert`

    ```json
    {
        "title": "new spawn",
        "waves": [
            { "count": 1, "spawn_moment": 20, "enemy_id": 1 },
            { "count": 3, "spawn_moment": 60, "enemy_id": 1 },
            { "count": 1, "spawn_moment": 80, "enemy_id": 1 }
        ]
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "title": "new spawn",
        "waves": [
            {
                "id": 5,
                "count": 1,
                "spawn_moment": 20,
                "enemy_id": 1
            },
            {
                "id": 6,
                "count": 3,
                "spawn_moment": 60,
                "enemy_id": 1
            },
            {
                "id": 7,
                "count": 1,
                "spawn_moment": 80,
                "enemy_id": 1
            }
        ]
    }
    ```

- `select` 

    ```json
    {
        "id": 2,
        "title": "new spawn",
        "waves": [
            {
                "id": 5,
                "count": 1,
                "spawn_moment": 20,
                "enemy_id": 1
            },
            {
                "id": 6,
                "count": 3,
                "spawn_moment": 60,
                "enemy_id": 1
            },
            {
                "id": 7,
                "count": 1,
                "spawn_moment": 80,
                "enemy_id": 1
            }
        ]
    }
    ```

- `update`

    ```json
    {
        "title": "spawn II",
        "waves": [
            { "id": 6, "count": 2, "spawn_moment": 20, "enemy_id": 1 },
            { "count": 1, "spawn_moment": 30, "enemy_id": 1 }
        ]
    }
    {
        "id": 2
    }
    {
        "id": 2,
        "title": "spawn II",
        "waves": [
            {
                "id": 6,
                "count": 2,
                "spawn_moment": 20,
                "enemy_id": 1
            },
            {
                "id": 8,
                "count": 1,
                "spawn_moment": 30,
                "enemy_id": 1
            }
        ]
    }
    ```
    
- `list`

    ```json
    {
        "spawn_scripts": [
            {
                "id": 1,
                "title": "сценарий одной волны врагов"
            },
            {
                "id": 2,
                "title": "spawn II"
            }
        ]
    }
    ```

- `delete`

    ```json
    {
        "rows": 1
    }
    ```

- `list`

    ```json
    {
        "spawn_scripts": [
            {
                "id": 1,
                "title": "сценарий одной волны врагов"
            }
        ]
    }
    ```
