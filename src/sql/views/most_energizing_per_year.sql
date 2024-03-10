CREATE VIEW most_energizing AS
SELECT
    year,
    id,
    name,
    popularity,
    energy
FROM (
    SELECT 
        t.year, 
        t.id, 
        t.name, 
        t.popularity, 
        t.energy,
        ROW_NUMBER() OVER (PARTITION BY t.year ORDER BY t.energy DESC, t.popularity DESC) as rn
    FROM tracks t ORDER BY t.year DESC
) ranked_tracks
WHERE rn = 1
