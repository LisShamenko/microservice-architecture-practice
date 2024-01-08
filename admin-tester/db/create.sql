


-- ########## types ##########



DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_point_types') THEN

    CREATE TYPE activity_point_types AS ENUM ('increment', 'decrement', 'teleport', 'none');
    CREATE TYPE enemy_types AS ENUM ('test');
    CREATE TYPE sorts AS ENUM ('none', 'weapons_asc', 'weapons_desc', 'shells_asc', 'shells_desc', 'clothes_asc', 'clothes_desc');

end if;
end $$;



-- ########## player ########## -> products



-- player_properties

CREATE TABLE IF NOT EXISTS player_properties (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    strength integer,
    endurance integer,
    intelligence integer,
    agility integer,
    fire_weapons integer,
    melee_weapons integer,
    throwing integer,
    doctor integer,
    sneak integer,
    steal integer,
    traps integer,
    science integer,
    repair integer,
    barter integer,
    PRIMARY KEY (id)
);

-- requirements

CREATE TABLE IF NOT EXISTS requirements (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text,
    player_level integer,
    strength integer,
    endurance integer,
    intelligence integer,
    agility integer,
    fire_weapons integer,
    melee_weapons integer,
    throwing integer,
    doctor integer,
    sneak integer,
    steal integer,
    traps integer,
    science integer,
    repair integer,
    barter integer,
    PRIMARY KEY (id)
);

-- skills -> requirements

CREATE TABLE IF NOT EXISTS skills (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text,
    parent_skill_id integer,
    requirement_id integer,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_s---requirement_id---requirements" 
        FOREIGN KEY (requirement_id)
        REFERENCES requirements (id),

    CONSTRAINT "fkey_self---parent_skill_id---id" 
        FOREIGN KEY (parent_skill_id)
        REFERENCES skills (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey---parent_skill_id---self" ON skills USING btree (parent_skill_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_requirement_id_fkey" ON skills USING btree (requirement_id ASC NULLS LAST);

-- inventory

CREATE TABLE IF NOT EXISTS inventory (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    sorts sorts DEFAULT 'none'::sorts,
    PRIMARY KEY (id)
);

-- level_templates -> inventory, player_properties

CREATE TABLE IF NOT EXISTS level_templates (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text,
    properties_id integer NOT NULL,
    inventory_id integer NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_lt---inventory_id---inventory" 
        FOREIGN KEY (inventory_id)
        REFERENCES inventory (id),

    CONSTRAINT "fkey_lt---properties_id---player_properties" 
        FOREIGN KEY (properties_id)
        REFERENCES player_properties (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_lt---inventory_id---inventory" ON level_templates USING btree (inventory_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_lt---properties_id---player_properties" ON level_templates USING btree (properties_id ASC NULLS LAST);

-- level_template_skills -> level_templates, skills

CREATE TABLE IF NOT EXISTS level_template_skills (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    level_template_id integer NOT NULL,
    skill_id integer NOT NULL,

    CONSTRAINT "fkey_lts---level_template_id---level_templates" 
        FOREIGN KEY (level_template_id)
        REFERENCES level_templates (id),

    CONSTRAINT "fkey_lts---skill_id---skills" 
        FOREIGN KEY (skill_id)
        REFERENCES skills (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_lts---level_template_id---level_templates" ON level_template_skills USING btree (level_template_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_lts---skill_id---skills" ON level_template_skills USING btree (skill_id ASC NULLS LAST);

-- players -> inventory, level_templates, player_properties

CREATE TABLE IF NOT EXISTS players (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    inventory_id integer NOT NULL,
    properties_id integer NOT NULL,
    level_template_id integer NOT NULL,
    login text,
    password text,
    firstname text,
    secondname text,
    thirdname text,
    email text,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_p---inventory_id---inventory" 
        FOREIGN KEY (inventory_id)
        REFERENCES inventory (id),

    CONSTRAINT "fkey_p---level_template_id---level_templates" 
        FOREIGN KEY (level_template_id)
        REFERENCES level_templates (id),

    CONSTRAINT "fkey_p---properties_id---player_properties" 
        FOREIGN KEY (properties_id)
        REFERENCES player_properties (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_p---inventory_id---inventory" ON players USING btree (inventory_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_p---level_template_id---level_templates" ON players USING btree (level_template_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_p---properties_id---player_properties" ON players USING btree (properties_id ASC NULLS LAST);

-- enemies -> inventory, level_templates, player_properties

CREATE TABLE IF NOT EXISTS enemies (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    inventory_id integer NOT NULL,
    properties_id integer NOT NULL,
    level_template_id integer NOT NULL,
    enemy_type enemy_types NOT NULL DEFAULT 'test'::enemy_types,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_e---inventory_id---inventory" 
        FOREIGN KEY (inventory_id)
        REFERENCES inventory (id),

    CONSTRAINT "fkey_e---level_template_id---level_templates" 
        FOREIGN KEY (level_template_id)
        REFERENCES level_templates (id),

    CONSTRAINT "fkey_e---properties_id---player_properties" 
        FOREIGN KEY (properties_id)
        REFERENCES player_properties (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_e---inventory_id---inventory" ON enemies USING btree (inventory_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_e---level_template_id---level_templates" ON enemies USING btree (level_template_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_e---properties_id---player_properties" ON enemies USING btree (properties_id ASC NULLS LAST);

-- level_effects -> players

CREATE TABLE IF NOT EXISTS level_effects (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    count_matches integer,
    is_equipment boolean,
    property_column text,
    delta_value integer,
    player_id integer,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_le---player_id---players" 
        FOREIGN KEY (player_id)
        REFERENCES players (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_le---player_id---players" ON level_effects USING btree (player_id ASC NULLS LAST);

-- player_skills -> players, skills

CREATE TABLE IF NOT EXISTS player_skills (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    player_id integer NOT NULL,
    skill_id integer NOT NULL,

    CONSTRAINT "fkey_ps---player_id---players" 
        FOREIGN KEY (player_id)
        REFERENCES players (id),

    CONSTRAINT "fkey_ps---skill_id---skills" 
        FOREIGN KEY (skill_id)
        REFERENCES skills (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey---skill_id---skills" ON player_skills USING btree (skill_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_requirements_id_for_skill_fkey" ON player_skills USING btree (player_id ASC NULLS LAST);



-- ########## products ########## -> requirements, skills



-- products -> requirements

CREATE TABLE IF NOT EXISTS products (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text,
    price integer NOT NULL,
    max_in_slot integer DEFAULT 1,
    requirement_id integer,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_p---requirement_id---requirements" 
        FOREIGN KEY (requirement_id)
        REFERENCES requirements (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey---product---requirements" ON products USING btree (requirement_id ASC NULLS LAST);

-- product_skills -> products, skills

CREATE TABLE IF NOT EXISTS product_skills (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id integer NOT NULL,
    skill_id integer NOT NULL,

    CONSTRAINT "fkey_product_skills---product_id---products" 
        FOREIGN KEY (product_id)
        REFERENCES products (id),

    CONSTRAINT "fkey_ps---skill_id---skills" 
        FOREIGN KEY (skill_id)
        REFERENCES skills (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_ps---product_id---products" ON product_skills USING btree (product_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_ps---skill_id---skills" ON product_skills USING btree (skill_id ASC NULLS LAST);

-- product_weapons -> products

CREATE TABLE IF NOT EXISTS product_weapons (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id integer NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_pw---product_id---products" 
        FOREIGN KEY (product_id)
        REFERENCES products (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_pw---product_id---products" ON product_weapons USING btree (product_id ASC NULLS LAST);

-- product_clothes -> products

CREATE TABLE IF NOT EXISTS product_clothes (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id integer NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_pc---product_id---products" 
        FOREIGN KEY (product_id)
        REFERENCES products (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_pc---product_id---products" ON product_clothes USING btree (product_id ASC NULLS LAST);

-- product_shells -> products

CREATE TABLE IF NOT EXISTS product_shells (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    product_id integer NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_product_shells---product_id---products" 
        FOREIGN KEY (product_id)
        REFERENCES products (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_product_shells---product_id---products" ON product_shells USING btree (product_id ASC NULLS LAST);

-- weapon_shells -> product_shells, product_weapons

CREATE TABLE IF NOT EXISTS weapon_shells (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    weapon_id integer NOT NULL,
    shell_id integer NOT NULL,

    CONSTRAINT "fkey_ws---shell_id---product_shells" 
        FOREIGN KEY (shell_id)
        REFERENCES product_shells (id),

    CONSTRAINT "fkey_ws---weapon_id---product_weapons" 
        FOREIGN KEY (weapon_id)
        REFERENCES product_weapons (id)
);
CREATE INDEX IF NOT EXISTS "fki_shell_id_fkey" ON weapon_shells USING btree (shell_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_weapon_id" ON weapon_shells USING btree (weapon_id ASC NULLS LAST);



-- ########## player ##########



-- inventory_products -> inventory, products

CREATE TABLE IF NOT EXISTS inventory_products (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    inventory_id integer NOT NULL,
    product_id integer NOT NULL,
    count_in_all_slots integer,

    CONSTRAINT "fkey_ip---inventory_id---inventory" 
        FOREIGN KEY (inventory_id)
        REFERENCES inventory (id),

    CONSTRAINT "fkey_ip---product_id---products" 
        FOREIGN KEY (product_id)
        REFERENCES products (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_ip---inventory_id---inventory" ON inventory_products USING btree (inventory_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_ip---product_id---products" ON inventory_products USING btree (product_id ASC NULLS LAST);



-- ########## games ##########



-- maps

CREATE TABLE IF NOT EXISTS maps (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    scene_id integer,
    PRIMARY KEY (id)
);

-- activity_point

CREATE TABLE IF NOT EXISTS activity_point (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    point_type activity_point_types NOT NULL DEFAULT 'none'::activity_point_types,
    PRIMARY KEY (id)
);

-- map_points -> maps, activity_point

CREATE TABLE IF NOT EXISTS map_points (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    point_id integer NOT NULL,
    map_id integer NOT NULL,
    title text,
    "position" real[] NOT NULL,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_mp---map_id---maps" 
        FOREIGN KEY (map_id)
        REFERENCES maps (id),

    CONSTRAINT "fkey_mp---point_id---activity_point" 
        FOREIGN KEY (point_id)
        REFERENCES activity_point (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_mp---map_id---maps" ON map_points USING btree (map_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_mp---point_id---activity_point" ON map_points USING btree (point_id ASC NULLS LAST);

-- spawn_scripts

CREATE TABLE IF NOT EXISTS spawn_scripts (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    PRIMARY KEY (id)
);

-- spawn_script_enemies -> enemies, spawn_scripts

CREATE TABLE IF NOT EXISTS spawn_script_enemies (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    script_id integer NOT NULL,
    enemy_id integer NOT NULL,
    count integer DEFAULT 0,
    spawn_moment integer DEFAULT 0,

    CONSTRAINT "fkey_sse---enemy_id---enemies" 
        FOREIGN KEY (enemy_id)
        REFERENCES enemies (id),

    CONSTRAINT "fkey_sse---script_id---spawn_scripts" 
        FOREIGN KEY (script_id)
        REFERENCES spawn_scripts (id)
);
CREATE INDEX IF NOT EXISTS "fki_enemy_id_fkey" ON spawn_script_enemies USING btree (enemy_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_script_id_fkey" ON spawn_script_enemies USING btree (script_id ASC NULLS LAST);

-- games -> maps, spawn_scripts

CREATE TABLE IF NOT EXISTS games (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    map_id integer NOT NULL,
    spawn_script_id integer,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_g---map_id---maps" 
        FOREIGN KEY (map_id)
        REFERENCES maps (id),

    CONSTRAINT "fkey_g---spawn_script_id---spawn_scripts" 
        FOREIGN KEY (spawn_script_id)
        REFERENCES spawn_scripts (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_g---map_id---maps" ON games USING btree (map_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_g---spawn_script_id---spawn_scripts" ON games USING btree (spawn_script_id ASC NULLS LAST);

-- game_enemies -> enemies, games

CREATE TABLE IF NOT EXISTS game_enemies (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    game_id integer NOT NULL,
    enemy_id integer NOT NULL,

    CONSTRAINT "fkey_ge---enemy_id---enemies" 
        FOREIGN KEY (enemy_id)
        REFERENCES enemies (id),

    CONSTRAINT "fkey_ge---game_id---games" 
        FOREIGN KEY (game_id)
        REFERENCES games (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_ge---enemy_id---enemies" ON game_enemies USING btree (enemy_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_ge---game_id---games" ON game_enemies USING btree (game_id ASC NULLS LAST);

-- game_players -> players, games

CREATE TABLE IF NOT EXISTS game_players (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    game_id integer NOT NULL,
    player_id integer NOT NULL,

    CONSTRAINT "fkey_gp---game_id---games" 
        FOREIGN KEY (game_id)
        REFERENCES games (id),

    CONSTRAINT "fkey_gp---player_id---players" 
        FOREIGN KEY (player_id)
        REFERENCES players (id)
);
CREATE INDEX IF NOT EXISTS "fki_fkey_gp---game_id---games" ON game_players USING btree (game_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_gp---player_id---players" ON game_players USING btree (player_id ASC NULLS LAST);
