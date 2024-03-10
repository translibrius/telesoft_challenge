CREATE VIEW track_details_with_danceability_and_followers AS
SELECT t.id, t.name, t.popularity, t.energy, t.danceability, a.followers
FROM tracks t
JOIN track_artists ta ON t.id = ta.track_id
JOIN artists a ON ta.artist_id = a.id
