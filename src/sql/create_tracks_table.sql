CREATE TABLE IF NOT EXISTS tracks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    popularity INTEGER,
    duration_ms INTEGER,
    explicit BOOLEAN,
    artists_id VARCHAR(255)[],
    release_date DATE,
    danceability VARCHAR(50),
    energy FLOAT,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    FOREIGN KEY (artists_id) REFERENCES artists(id)
);
