
-- insert skills

INSERT INTO requirements(
	title, player_level, 
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
) 
VALUES (
    'minimal', 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0
), ( 
    'jump kick I', 5, 5, 0, 0, 5,
	0, 10, 0, 0, 0, 0, 0, 0, 0, 0
), (
    'jump kick II', 10, 6, 0, 0, 6,
	0, 30, 0, 0, 0, 0, 0, 0, 0, 0
), (
    'jump kick III', 10, 8, 0, 0, 6,
	0, 70, 0, 0, 0, 0, 0, 0, 0, 0
); -- 1,2,3,4

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар', NULL, 2); -- 1

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар в прыжке', 1, 3); -- 2

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар в двойном прыжке', 2, 4); -- 3

-- insert template

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (
    5, 6, 4, 5,
    14, 13, 14, 3, 13, 3, 6, 1, 3, 16
), (
    6, 7, 3, 6,
    21, 49, 38, 6, 30, 4, 8, 4, 5, 49
), (
    9, 8, 1, 8,
    36, 91, 65, 10, 35, 6, 10, 6, 8, 50
); -- 1,2,3

INSERT INTO inventory (sorts) VALUES ('none'); -- 1

INSERT INTO level_templates (title, properties_id, inventory_id)
VALUES ('юный боец на ногах', 1, 1), 
    ('опытный боец на ногах', 2, 1), 
    ('мастер боя на ногах', 3, 1); -- 1,2,3

INSERT INTO level_template_skills (level_template_id, skill_id) 
VALUES (1, 1), (2, 1), (2, 2), (3, 1), (3, 2), (3, 3);

-- insert enemy

INSERT INTO inventory (sorts) VALUES ('none'); -- 2

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (6, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49); -- 4

INSERT INTO enemies (inventory_id, properties_id, level_template_id, enemy_type)
VALUES (2, 4, 1, 'test'::enemy_types); -- 1

-- insert player

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15); -- 5

INSERT INTO inventory (sorts) VALUES ('none'); -- 3

INSERT INTO level_templates (title, properties_id, inventory_id)
VALUES ('шаблон игрока', 5, 3); -- 4

-- INSERT INTO level_template_skills (level_template_id, skill_id) VALUES (4, 1);

INSERT INTO inventory (sorts) VALUES ('none'); -- 4

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15); -- 6

INSERT INTO players (
    inventory_id, properties_id, level_template_id,
    login, password, firstname, secondname, thirdname, email
)
VALUES (
    4, 6, 4, 'login', 'password', 'first', 'second', 'third', 'fst@email.com'
); -- 1

INSERT INTO level_effects (
    count_matches, is_equipment, property_column, delta_value, player_id
)
VALUES (1, false, 'strength', 5, 1);

INSERT INTO player_skills (player_id, skill_id) VALUES (1, 1);

-- insert product

INSERT INTO requirements(
	title, player_level, 
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
) 
VALUES ('for kick III', 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); -- 5

INSERT INTO products (title, price, max_in_slot, requirement_id)
VALUES ('штаны пинателя', 1, 1, 5); -- 1;

INSERT INTO product_skills (product_id, skill_id) VALUES (1, 3);

INSERT INTO product_clothes (product_id) VALUES (1); -- 1

INSERT INTO inventory_products (
    inventory_id, product_id, count_in_all_slots
) 
VALUES (4, 1, 1);

-- insert other products

--      INSERT INTO product_weapons (product_id) VALUES (...); -- 1
--      INSERT INTO product_shells (product_id) VALUES (...); -- 1
--      INSERT INTO weapon_shells (weapon_id, shell_id) VALUES (1, 1);

-- insert map

INSERT INTO maps (scene_id) VALUES (1); -- 1

INSERT INTO activity_point (point_type) VALUES ('teleport'); -- 1

INSERT INTO map_points (point_id, map_id, title, "position") 
VALUES (1, 1, 'телепорт 1', ARRAY [-10, 0, 0]); -- 1
INSERT INTO map_points (point_id, map_id, title, "position") 
VALUES (1, 1, 'телепорт 2', ARRAY [10, 0, 0]); -- 2

INSERT INTO spawn_scripts (title) VALUES ('сценарий одной волны врагов'); -- 1

INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 2, 0);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 4, 25);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 2, 50);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 4, 75);

INSERT INTO games (map_id, spawn_script_id) VALUES (1, 1); -- 1

INSERT INTO game_enemies (game_id, enemy_id) VALUES (1, 1);

INSERT INTO game_players (game_id, player_id) VALUES (1, 1);
