/*
    HERE WE PARSE THROUGH THE DOWNLOADED DATASET
    AND TRANSFORM THE DATA SUITING OUR NEEDS
    PREPAIRING IT TO BE PUT IN A DB
*/

// Todo: Review error handling and things that can go wrong before submitting.

const fs = require('fs');
const parse = require('csv-parse');

const artistsPath = './raw_data/artists.csv';
const tracksPath = './raw_data/tracks.csv';
const dictPath = './raw_data/dict_artist.json';

const parseDataset = async () => {
    try {
        const { filteredTracks, artistIds } = await parseTracks();
        const filteredArtists = await parseArtists(artistIds);
        return { filteredTracks, filteredArtists };
    } catch (parseErr) {
        console.error('Error while parsing dataset: ', parseErr);
    }
};

const parseTracks = () => {
    console.log('Parsing tracks.csv...');
    return new Promise((resolve, reject) => {
        const tracks = [];
        const artistIds = new Set();

        const tracksParser = parse.parse({
            columns: true,
            trim: true,
            skip_empty_lines: true
        });

        fs.createReadStream(tracksPath)
            .pipe(tracksParser)
            .on('data', (record) => {
                passedTracksFilter = record.name && parseInt(record.duration_ms) >= 60000;
                if (passedTracksFilter) {
                    JSON.parse(record.id_artists.replace(/'/g, '"')).forEach(
                        id => artistIds.add(id)
                    );

                    // Explode date
                    const [year, month, day] = record.release_date.split('-');

                    // Edit danceability
                    let danceability = parseFloat(record.danceability);
                    danceability = danceability < 0.5 ? 'Low' :
                                    danceability <= 0.6 ? 'Medium' : 'High';

                    transformedTracks = {
                        ...record,
                        year, month, day,
                        danceability,
                    };

                    // Delete release_date because
                    // we now have year;month;day (Unsure if needed)
                    delete transformedTracks.release_date;

                    tracks.push(transformedTracks);
                }
            })
            .on('end', () => {
                console.log(`Finished parsing tracks.csv`);
                console.log(`Filtered tracks count: ${tracks.length}`);
                console.log(`Unique artist IDs count: ${artistIds.size}`);
                resolve({ tracks, artistIds });
            })
            .on('error', (err) => {
                console.log(`Parsing tracks.csv failed, err: ${err}`);
                reject(err);
            });
    });
};

const parseArtists = (artistIds) => {
    console.log('Parsing artists.csv...');
    return new Promise((resolve, reject) => {
        const artists = [];

        const artistsParser = parse.parse({
            columns: true,
            trim: true,
            skip_empty_lines: true
        });

        fs.createReadStream(artistsPath)
            .pipe(artistsParser)
            .on('data', (record) => {
                if (artistIds.has(record.id)) {
                    artists.push(record);
                }
            })
            .on('end', () => {
                console.log(`Finished parsing artists.csv`);
                console.log(`Filtered artists count: ${artists.length}`);
                resolve(artists);
            })
            .on('error', (err) => {
                console.log(`Parsing artists.csv failed, err: ${err}`);
                reject(err);
            });
    });
};


module.exports = {
    parseDataset,
};
