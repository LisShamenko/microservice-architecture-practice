
CREATE TYPE file_status AS ENUM ('uploaded', 'accepted', 'rejected');

-- users

CREATE TABLE users (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    login text NOT NULL,
    PRIMARY KEY (id)
);

-- user_files

CREATE TABLE user_files
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL,
    url text NOT NULL,
    title text,
    is_loaded boolean DEFAULT false,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_uf---user_id---users" 
        FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS "fki_fkey_uf---user_id---users" ON user_files USING btree (user_id ASC NULLS LAST);

-- test_models

CREATE TABLE IF NOT EXISTS test_models (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    title text,
    description text,
    photo_url text,
    video_url text,
    notes text[],
    status file_status,
    user_id integer NOT NULL,
    file_id integer,
    PRIMARY KEY (id),

    CONSTRAINT "fkey_tm---user_id---users" 
        FOREIGN KEY (user_id)
        REFERENCES users (id),

    CONSTRAINT "fkey_tm---file_id---user_files" 
        FOREIGN KEY (file_id)
        REFERENCES user_files (id)
);

CREATE INDEX IF NOT EXISTS "fki_fkey_tm---user_id---users" ON test_models USING btree (user_id ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS "fki_fkey_tm---file_id---user_files" ON test_models USING btree (file_id ASC NULLS LAST);
