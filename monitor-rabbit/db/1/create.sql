
-- ########## types ##########

CREATE TYPE db_query_type AS ENUM ('none', 'mongo', 'sequelize', 'typeorm');

-- db_queries

CREATE TABLE IF NOT EXISTS db_queries
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    query_type db_query_type NOT NULL,
    data jsonb NOT NULL,
    create_at timestamp without time zone NOT NULL,
    PRIMARY KEY (id)
);
