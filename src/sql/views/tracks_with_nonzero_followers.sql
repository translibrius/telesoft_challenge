CREATE VIEW view_tracks_with_artist_followers AS
SELECT *
FROM tracks t
JOIN track_artists ta ON t.id = ta.track_id
JOIN artists a ON ta.artist_id = a.id
WHERE a.followers > 0;
