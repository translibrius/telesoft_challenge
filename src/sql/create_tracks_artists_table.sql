CREATE TABLE IF NOT EXISTS track_artists (
    track_id VARCHAR(255),
    artist_id VARCHAR(255),
    PRIMARY KEY (track_id, artist_id),
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);