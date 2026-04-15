CREATE TABLE IF NOT EXISTS restaurants (
    id                INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name              TEXT NOT NULL,
    url               TEXT,
    rating            DOUBLE PRECISION,
    rating_count      DOUBLE PRECISION,
    detailed_ratings  TEXT,
    price_category    DOUBLE PRECISION,
    address           TEXT,
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    zip_code          TEXT
);
