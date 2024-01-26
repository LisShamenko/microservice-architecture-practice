
-- select skills

SELECT * FROM skills s JOIN requirements r ON s.requirement_id = r.id;

-- select template

SELECT 
    lt.title AS "template", 
    s.title AS "skill", 
    r.title AS "requirement",
    r.strength AS "need strength", 
    r.agility  AS "need agility",
    i.sorts AS "inventory sorts",
    pp.strength AS "have strength", 
    pp.agility  AS "have agility"
FROM level_templates lt
JOIN level_template_skills lts ON lts.level_template_id = lt.id
JOIN skills s ON s.id = lts.skill_id
JOIN requirements r ON s.requirement_id = r.id
JOIN inventory i ON lt.inventory_id = i.id
JOIN player_properties pp ON lt.properties_id = pp.id;

-- select enemy

SELECT
    e.nickname AS "enemy name",
    e.enemy_type AS "enemy type",
    lt.title AS "enemy title",
    lt.coins AS "coins",
    pp.strength AS "strength",
    pp.endurance AS "endurance",
    pp.intelligence AS "intelligence",
    pp.agility AS "agility"
FROM enemies e
JOIN level_templates lt ON lt.id = e.level_template_id
JOIN player_properties pp ON pp.id = e.properties_id;

-- compare properties for player and template

SELECT 
    concat(p.firstname, ' ', p.secondname, ' ', p.thirdname) AS "player's name",
    lt.title AS "template name",
    pp1.strength AS "template's strength",
    pp2.strength AS "player's strength"
FROM players p
JOIN level_templates lt ON p.level_template_id = lt.id
JOIN player_properties pp1 ON lt.properties_id = pp1.id
JOIN player_properties pp2 ON p.properties_id = pp2.id;

-- select player's effects

SELECT p.login, le.* FROM players p
JOIN level_effects le ON le.player_id = p.id;

-- select player's products

SELECT
    plr.firstname AS "player", 
    prd.title AS "product", 
    prd.price AS "price",
    r.title AS "requirement title",
    r.player_level AS "requirement level",
    r.strength AS "requirement strength",
    r.agility AS "requirement agility",
    r.throwing AS "requirement throwing"
FROM players plr
JOIN inventory i ON plr.inventory_id = i.id
JOIN inventory_products ip ON ip.inventory_id = i.id
JOIN products prd ON ip.product_id = prd.id
JOIN requirements r ON prd.requirement_id = r.id;

-- select activity points

SELECT m.title AS "map title", mp.position AS "point position"
FROM games g 
JOIN maps m ON g.map_id = m.id
JOIN map_points mp ON mp.map_id = m.id;

SELECT m.title AS "map title", ap.point_type AS "point type", at.*
FROM games g 
JOIN maps m ON g.map_id = m.id
JOIN activity_points ap ON ap.map_id = m.id
JOIN activity_teleports at ON at.activity_id = ap.id;

SELECT m.title AS "map title", ap.point_type AS "point type", a_s.*
FROM games g 
JOIN maps m ON g.map_id = m.id
JOIN activity_points ap ON ap.map_id = m.id
JOIN activity_spawns a_s ON a_s.activity_id = ap.id;

-- select spawn scripts

SELECT 
    ss.title AS "script name",
    sse.count AS "count enemies",
    sse.spawn_moment AS "spawn moment (%)",
    e.enemy_type AS "enemy type",
    lt.title AS "enemy title",
    pp.strength AS "strength"
FROM games g 
JOIN spawn_scripts ss ON g.spawn_script_id = ss.id
JOIN spawn_script_enemies sse ON sse.script_id = ss.id
JOIN enemies e ON sse.enemy_id = e.id
JOIN level_templates lt ON lt.id = e.level_template_id
JOIN player_properties pp ON pp.id = e.properties_id;

-- select players in game 

SELECT 
    concat(p.firstname, ' ', p.secondname, ' ', p.thirdname) AS "players in game"
FROM games g
JOIN game_players gp ON gp.game_id = g.id
JOIN players p ON gp.player_id = p.id;

-- select enemies in game 


