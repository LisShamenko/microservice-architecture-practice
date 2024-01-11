
-- insert skills

INSERT INTO requirements(
	title, player_level, 
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
) 
VALUES 
	('minimal', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0), 
	('jump kick I', 5, 5, 0, 0, 5, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0), 
	('jump kick II', 10, 6, 0, 0, 6, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0), 
	('jump kick III', 10, 8, 0, 0, 6, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0);
-- 1,2,3,4

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар', NULL, 2);
-- 1

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар в прыжке', 1, 3);
-- 2

INSERT INTO skills (title, parent_skill_id, requirement_id)
VALUES ('удар в двойном прыжке', 2, 4);
-- 3

-- insert template

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES 
	(5, 6, 4, 5, 14, 13, 14, 3, 13, 3, 6, 1, 3, 16), 
	(6, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49), 
	(9, 8, 1, 8, 36, 91, 65, 10, 35, 6, 10, 6, 8, 50);
-- 1,2,3

INSERT INTO inventory (sorts) VALUES ('none');
-- 1

INSERT INTO level_templates (title, properties_id, inventory_id, coins)
VALUES 
	('юный боец на ногах', 1, 1, 100), 
    ('опытный боец на ногах', 2, 1, 200), 
    ('мастер боя на ногах', 3, 1, 400);
-- 1,2,3

INSERT INTO level_template_skills (level_template_id, skill_id) 
VALUES (1, 1), (2, 1), (2, 2), (3, 1), (3, 2), (3, 3);

-- insert enemy

INSERT INTO inventory (sorts) VALUES ('none');
-- 2

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (6, 7, 3, 6, 21, 49, 38, 6, 30, 4, 8, 4, 5, 49);
-- 4

INSERT INTO enemies (nickname, inventory_id, properties_id, level_template_id, enemy_type)
VALUES ('first enemy', 2, 4, 1, 'test'::enemy_types);
-- 1

-- insert player template

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15);
-- 5

INSERT INTO inventory (sorts) VALUES ('none');
-- 3

INSERT INTO level_templates (title, properties_id, inventory_id, coins) 
VALUES ('шаблон игрока', 5, 3, 1000);
-- 4

-- INSERT INTO level_template_skills (level_template_id, skill_id) VALUES (4, 1);

-- insert player I

INSERT INTO inventory (sorts) VALUES ('none');
-- 4

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15);
-- 6

INSERT INTO players (inventory_id, properties_id, level_template_id, login, password, firstname, secondname, thirdname, email)
VALUES (4, 6, 4, 'login', 'password', 'first', 'second', 'third', 'fst@email.com');
-- 1

INSERT INTO level_effects (
    count_matches, is_equipment, property_column, delta_value, player_id
)
VALUES (1, false, 'strength', 5, 1);

INSERT INTO player_skills (player_id, skill_id) VALUES (1, 1);

-- insert player II

INSERT INTO inventory (sorts) VALUES ('none');
-- 5

INSERT INTO player_properties(
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
)
VALUES (5, 5, 5, 5, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15);
-- 7

INSERT INTO players (inventory_id, properties_id, level_template_id, login, password, firstname, secondname, thirdname, email)
VALUES (5, 7, 4, 'log', 'pas', 'f1', 's2', 't3', 'f1s2t3@email.com');
-- 2

-- insert product

INSERT INTO requirements(
	title, player_level, 
	strength, endurance, intelligence, agility, 
	fire_weapons, melee_weapons, throwing, doctor, 
	sneak, steal, traps, science, repair, barter
) 
VALUES ('for kick III', 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
-- 5

INSERT INTO products (title, price, max_in_slot, requirement_id, product_type) VALUES ('штаны пинателя', 1, 5, 5, 'cloth');
-- 1
INSERT INTO products (title, price, max_in_slot, requirement_id, product_type) VALUES ('ракушки', 1, 50, 5, 'shell');
-- 2
INSERT INTO products (title, price, max_in_slot, requirement_id, product_type) VALUES ('меч', 1, 1, 5, 'weapon');
-- 3

INSERT INTO product_skills (product_id, skill_id) VALUES (1, 3);

INSERT INTO product_clothes (product_id) VALUES (1);
-- 1
INSERT INTO product_shells (product_id) VALUES (2);
-- 1
INSERT INTO product_weapons (product_id) VALUES (3);
-- 1

INSERT INTO inventory_products (inventory_id, product_id, count_in_all_slots) VALUES (4, 1, 1);
INSERT INTO inventory_products (inventory_id, product_id, count_in_all_slots) VALUES (4, 2, 25);

INSERT INTO inventory_products(inventory_id, product_id, count_in_all_slots) VALUES (1, 1, 2);
INSERT INTO inventory_products (inventory_id, product_id, count_in_all_slots) VALUES (1, 2, 5);

-- insert other products

-- INSERT INTO product_weapons (product_id) VALUES (...);
-- 1
-- INSERT INTO product_shells (product_id) VALUES (...);
-- 1
-- INSERT INTO weapon_shells (weapon_id, shell_id) VALUES (1, 1);

-- insert map

INSERT INTO maps (scene_id, title) VALUES (1, 'первая карта');
-- 1

INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [1, 0, 9]);
-- 1
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [2, 0, 8]);
-- 2
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [3, 0, 7]);
-- 3
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [4, 0, 6]);
-- 4
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [5, 0, 5]);
-- 5
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [6, 0, 4]);
-- 6
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [7, 0, 3]);
-- 7
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [8, 0, 2]);
-- 8
INSERT INTO map_points (map_id, "position") VALUES (1, ARRAY [9, 0, 1]);
-- 9

INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('spawn', 1, 1);
-- 1
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('spawn', 1, 2);
-- 2
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('teleport', 1, 3);
-- 3
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('teleport', 1, 4);
-- 4
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('teleport', 1, 5);
-- 5
-- INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('supply', 1, 6);
-- 6
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('none', 1, 7);
-- 7
INSERT INTO activity_points (point_type, map_id, point_id) VALUES ('none', 1, 8);
-- 8

INSERT INTO activity_spawns (is_player, is_enemy, activity_id) VALUES (true, false, 1);
-- 1
INSERT INTO activity_spawns (is_player, is_enemy, activity_id) VALUES (false, true, 2);
-- 2

INSERT INTO activity_teleports (prev_activity_id, activity_id, next_activity_id) VALUES (5, 3, 4);
-- 1
INSERT INTO activity_teleports (prev_activity_id, activity_id, next_activity_id) VALUES (3, 4, 5);
-- 2
INSERT INTO activity_teleports (prev_activity_id, activity_id, next_activity_id) VALUES (4, 5, 3);
-- 3

INSERT INTO spawn_scripts (title) VALUES ('сценарий одной волны врагов');
-- 1

INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 2, 0);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 4, 25);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 2, 50);
INSERT INTO spawn_script_enemies (script_id, enemy_id, count, spawn_moment) 
VALUES (1, 1, 4, 75);

-- INSERT INTO games (map_id, spawn_script_id, owner_player_id) VALUES (1, 1, 1);
-- 1
-- INSERT INTO game_players (game_id, player_id) VALUES (1, 1);
