CREATE TABLE IF NOT EXISTS artists (
    id VARCHAR(255) PRIMARY KEY,
    followers INTEGER,
    genres TEXT[],
    name VARCHAR(255) NOT NULL,
    popularity INTEGER
);
