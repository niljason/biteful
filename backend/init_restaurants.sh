#!/bin/bash

<<<<<<< HEAD
# 1. Load environment variables
=======
# 1. Load environment variables from the shared .env
>>>>>>> fc69b3d (Initial map integration for restaurants)
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo "Error: .env file not found!"
    exit 1
fi

<<<<<<< HEAD
=======
# 2. Setup temporary .pgpass for this session
>>>>>>> fc69b3d (Initial map integration for restaurants)
PGPASS_PATH="$HOME/.pgpass"
echo "127.0.0.1:5432:$DB_NAME:$DB_USER:$DB_PASSWORD" > "$PGPASS_PATH"
chmod 0600 "$PGPASS_PATH"

<<<<<<< HEAD
# 2. Configuration
FILE_NAME="./dohmh_restaurant_04132026.csv"
TABLE_NAME="restaurants"

echo "Ingesting NYC Restaurant Data..."

psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" <<EOF

CREATE TEMP TABLE staging_restaurants (
    camis TEXT, dba TEXT, boro TEXT, building TEXT, street TEXT, 
    zipcode TEXT, phone TEXT, cuisine_description TEXT, inspection_date TEXT,
    action TEXT, violation_code TEXT, violation_description TEXT, 
    critical_flag TEXT, score TEXT, grade TEXT, grade_date TEXT, 
    record_date TEXT, inspection_type TEXT, latitude TEXT, longitude TEXT,
    council_district TEXT, bin TEXT, community_board TEXT, nta TEXT, 
    census_tract TEXT, bbl TEXT, location TEXT
);

\copy staging_restaurants FROM '$FILE_NAME' WITH (FORMAT csv, HEADER true, QUOTE '"', ENCODING 'UTF8');

-- Deduplicate and Insert
INSERT INTO $TABLE_NAME (
    camis, name, boro, building, street, zipcode, phone, 
    cuisine, inspection_date, grade, latitude, longitude
)
SELECT DISTINCT ON (camis::INT)
    camis::INT,
    TRIM(dba),
    boro,
    building,
    street,
    zipcode,
    phone,
    cuisine_description,
    CASE 
        WHEN inspection_date LIKE '1900%' OR inspection_date = '' THEN NULL 
        ELSE (inspection_date::TIMESTAMP)::DATE 
    END,
    NULLIF(TRIM(grade), ''),
    NULLIF(latitude, '')::DOUBLE PRECISION,
    NULLIF(longitude, '')::DOUBLE PRECISION
FROM staging_restaurants
WHERE action != 'Establishment Closed'
  AND latitude IS NOT NULL 
  AND latitude != '0'
  AND latitude != ''
ORDER BY camis::INT, 
         CASE WHEN inspection_date LIKE '1900%' THEN '0001-01-01'::DATE ELSE (inspection_date::TIMESTAMP)::DATE END DESC;

-- Standardize Phone Numbers
UPDATE $TABLE_NAME
SET phone = SUBSTRING(digits FROM 1 FOR 3) || '-' ||
            SUBSTRING(digits FROM 4 FOR 3) || '-' ||
            SUBSTRING(digits FROM 7 FOR 4)
FROM (SELECT camis as c_id, REGEXP_REPLACE(phone, '\D', '', 'g') AS digits FROM $TABLE_NAME) AS s
WHERE camis = s.c_id 
  AND LENGTH(s.digits) >= 10;

EOF

rm "$PGPASS_PATH"
echo "Ingestion Complete. Restaurants are now deduplicated."
=======
# 3. File and Table Configuration
FILE_NAME="./migrations/restaurantsnyc.csv"
TABLE_NAME="restaurants"

if [ ! -f "$FILE_NAME" ]; then
    echo "Error: $FILE_NAME not found!"
    rm "$PGPASS_PATH"
    exit 1
fi

echo "Ingesting $FILE_NAME into $DB_NAME..."

# 4. Execute SQL via Heredoc
psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" <<EOF
-- Clear old data
TRUNCATE TABLE $TABLE_NAME;

-- Create staging table 
CREATE TEMP TABLE staging (
    url              TEXT,
    name             TEXT,
    rating           TEXT,
    rating_count     TEXT,
    detailed_ratings TEXT,
    price_category   TEXT,
    address          TEXT,
    lat              TEXT,
    lon              TEXT,
    zip_code         TEXT
);

-- Import raw data
\copy staging FROM '$FILE_NAME' WITH (FORMAT csv, HEADER true, QUOTE '"', ENCODING 'UTF8');

-- Map and clean data into production
INSERT INTO $TABLE_NAME (name, url, rating, rating_count, price_category, address, latitude, longitude, zip_code)
SELECT
    NULLIF(TRIM(name), ''),
    NULLIF(TRIM(url), ''),
    NULLIF(TRIM(rating), '')::double precision,
    NULLIF(TRIM(rating_count), '')::double precision,
    NULLIF(TRIM(price_category), '')::double precision,
    NULLIF(TRIM(address), ''),
    NULLIF(TRIM(lat), '')::double precision,
    NULLIF(TRIM(lon), '')::double precision,
    NULLIF(TRIM(zip_code), '')
FROM staging
WHERE NULLIF(TRIM(name), '') IS NOT NULL;

EOF

# 5. Cleanup
rm "$PGPASS_PATH"
echo "------------------------------------------"
echo "Ingestion Successful!"
>>>>>>> fc69b3d (Initial map integration for restaurants)
