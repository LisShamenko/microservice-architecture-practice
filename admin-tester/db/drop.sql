
-- game_players

DROP TABLE IF EXISTS game_players;
--      DROP INDEX "fki_fkey_gp---game_id---games";
--      DROP INDEX "fki_fkey_gp---player_id---players";

-- game_enemies

DROP TABLE IF EXISTS game_enemies;
--      DROP INDEX "fki_fkey_ge---enemy_id---enemies";
--      DROP INDEX "fki_fkey_ge---game_id---games";

-- games

DROP TABLE IF EXISTS games;
--      DROP INDEX "fki_fkey_g---map_id---maps";
--      DROP INDEX "fki_fkey_g---spawn_script_id---spawn_scripts";

-- spawn_script_enemies

DROP TABLE IF EXISTS spawn_script_enemies;
--      DROP INDEX fki_enemy_id_fkey;
--      DROP INDEX fki_script_id_fkey;

-- spawn_scripts

DROP TABLE IF EXISTS spawn_scripts;

-- map_points

DROP TABLE IF EXISTS map_points;
--      DROP INDEX "fki_fkey_mp---map_id---maps";
--      DROP INDEX "fki_fkey_mp---point_id---activity_point";

-- activity_point

DROP TABLE IF EXISTS activity_point;

-- maps

DROP TABLE IF EXISTS maps;

-- inventory_products

DROP TABLE IF EXISTS inventory_products;
--      DROP INDEX "fki_fkey_ip---inventory_id---inventory";
--      DROP INDEX "fki_fkey_ip---product_id---products";

-- weapon_shells

DROP TABLE IF EXISTS weapon_shells;
--      DROP INDEX fki_shell_id_fkey;
--      DROP INDEX fki_weapon_id;

-- product_shells

DROP TABLE IF EXISTS product_shells;
--      DROP INDEX "fki_fkey_product_shells---product_id---products";

-- product_clothes

DROP TABLE IF EXISTS product_clothes;
--      DROP INDEX "fki_fkey_pc---product_id---products";

-- product_weapons

DROP TABLE IF EXISTS product_weapons;
--      DROP INDEX "fki_fkey_pw---product_id---products";

-- product_skills

DROP TABLE IF EXISTS product_skills;
--      DROP INDEX "fki_fkey_ps---product_id---products";
--      DROP INDEX "fki_fkey_ps---skill_id---skills";

-- products

DROP TABLE IF EXISTS products;
--      DROP INDEX "fki_fkey---product---requirements";

-- player_skills

DROP TABLE IF EXISTS player_skills;
--      DROP INDEX "fki_fkey---skill_id---skills";
--      DROP INDEX fki_requirements_id_for_skill_fkey;

-- level_effects

DROP TABLE IF EXISTS level_effects;
--      DROP INDEX "fki_fkey_le---player_id---players";

-- enemies

DROP TABLE IF EXISTS enemies;
--      DROP INDEX "fki_fkey_e---inventory_id---inventory";
--      DROP INDEX "fki_fkey_e---level_template_id---level_templates";
--      DROP INDEX "fki_fkey_e---properties_id---player_properties";

-- players

DROP TABLE IF EXISTS players;
--      DROP INDEX "fki_fkey_p---inventory_id---inventory";
--      DROP INDEX "fki_fkey_p---level_template_id---level_templates";
--      DROP INDEX "fki_fkey_p---properties_id---player_properties";

-- level_template_skills

DROP TABLE IF EXISTS level_template_skills;
--      DROP INDEX "fki_fkey_lts---level_template_id---level_templates";
--      DROP INDEX "fki_fkey_lts---skill_id---skills";

-- level_templates

DROP TABLE IF EXISTS level_templates;
--      DROP INDEX "fki_fkey_lt---inventary_id---inventory";
--      DROP INDEX "fki_fkey_lt---properties_id---player_properties";

-- inventory

DROP TABLE IF EXISTS inventory;

-- skills

DROP TABLE IF EXISTS skills;
--      DROP INDEX "fki_fkey---parent_skill_id---self";
--      DROP INDEX fki_requirement_id_fkey;

-- requirements

DROP TABLE IF EXISTS requirements;

-- player_properties

DROP TABLE IF EXISTS player_properties;

-- types

DROP TYPE IF EXISTS activity_point_types;
DROP TYPE IF EXISTS enemy_types;
DROP TYPE IF EXISTS sorts;
