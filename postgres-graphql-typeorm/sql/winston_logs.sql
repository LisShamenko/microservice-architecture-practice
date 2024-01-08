CREATE TABLE public.winston_logs
(
    level character varying COLLATE pg_catalog."default",
    message json,
    meta json,
    "timestamp" timestamp without time zone DEFAULT now()
)
TABLESPACE pg_default;
ALTER TABLE public.winston_logs OWNER to postgres;