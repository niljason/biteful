CREATE TABLE IF NOT EXISTS food_pantries (
    id SERIAL PRIMARY KEY,
    agency TEXT,
    day_of_week TEXT,
    open_time TEXT,
    close_time TEXT,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);