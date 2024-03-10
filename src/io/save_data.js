const fs = require('node:fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

const utils = require('../utils/utils');

// For kaggle downloading
const kaggle_api = require('../api/kaggle');
const kaggleDatasetUrl = 'yamaerenay/spotify-dataset-19212020-600k-tracks';
const zipFilePath = './raw_data/dataset.zip';
const uselessFilePath = './raw_data/dict_artists.json'; // We get this together with useful data in zip, but we dont need it
const extractToPath = './raw_data/';

// Downloads dataset from Kaggle and unzips it inside ./raw_data
const downloadDataAndUnzip = async () => {
    try {
        data_exists = await utils.ensureDirectoryExists('./raw_data');
        const expectedFiles = ['tracks.csv', 'artists.csv'];
        files_exist = utils.allFilesExist('./raw_data/', expectedFiles);

        if (!data_exists || !files_exist) {
            console.log('Data files not found or incomplete, downloading...');
            await kaggle_api.downloadDataset(kaggleDatasetUrl, zipFilePath);
            await utils.extractZip(zipFilePath, extractToPath);
            await utils.deleteFile(zipFilePath);
            await utils.deleteFile(uselessFilePath);
        } else {
            console.log('Found raw_data, skipping download...');
        }
    } catch (error) {
        console.error('Error while downloading or processing dataset from kaggle: ', error);
    }
};

// Bundles the processed data save operation into one function while checking if it already exists.
const saveProcessedData = async (filteredTracks, filteredArtists) => {
    processed_data_exists = await utils.ensureDirectoryExists('./processed_data/');
    const expectedFiles = ['tracks.csv', 'artists.csv', 'track_artists.csv'];
    files_exist = utils.allFilesExist('./processed_data/', expectedFiles);

    if (!processed_data_exists || !files_exist) {
        await saveDataToCsv(filteredArtists, './processed_data/', 'artists.csv');
        await saveDataToCsv(filteredTracks, './processed_data/', 'tracks.csv');

        // All valid artist id's from the processed CSV
        const validArtistIds = new Set(filteredArtists.map(artist => artist.id));
        await saveTrackToArtistsCsv(filteredTracks, validArtistIds, './processed_data/', 'track_artists.csv');
    } else {
        console.log('Found processed_data, skipping saving...');
    }
};

// Saves processed data from memory to CSV (instead of downloading from S3 again)
const saveDataToCsv = async (data, directory, filename) => {
    const fullPath = path.join(directory, filename);

    // Modify data to ensure postgre accepts formatting
    const formattedData = data.map((record) => {
        const newRecord = { ...record };
        
        // Formats followers from floating point like 155.0 to 155
        if (newRecord.followers) {
            newRecord.followers = parseInt(newRecord.followers) || 0;
        }

        // Formats id_artists, artists and genres like "['desi pop', 'punjabi hip hop', 'punjabi pop']"
        // to {'desi pop', 'punjabi hip hop', 'punjabi pop'} for TEXT[] in postgre
        if (newRecord.genres) {
            newRecord.genres = utils.formatStringArrayForPostgres(newRecord.genres);
        }
        if (newRecord.id_artists) {
            newRecord.id_artists = utils.formatStringArrayForPostgres(newRecord.id_artists);
        }
        if (newRecord.artists) {
            newRecord.artists = utils.formatStringArrayForPostgres(newRecord.artists);
        }

        return newRecord;
    });

    const headers = formattedData.length > 0 ? Object.keys(formattedData[0]).map(key => ({ id: key, title: key })) : [];

    const csvWriter = createCsvWriter({
        path: fullPath,
        header: headers
    });

    try {
        await csvWriter.writeRecords(formattedData); // Use formattedData here
        console.log(`Data saved to CSV at ${fullPath}`);
    } catch (err) {
        console.error(`Error saving data to CSV: ${err}`);
    }
};

// Saves processed data from memory to CSV for SQL junction relationship
const saveTrackToArtistsCsv = async (tracksData, validArtistIds, directory, filename) => {
    const fullPath = path.join(directory, filename);
    let trackArtistPairs = [];

    let test = 0;

    // Extract track-artist pairs
    for (const track of tracksData) {
        const trackId = track.id;
        const artistIds = track.id_artists
            .substring(1, track.id_artists.length - 1) // Remove the curly braces
            .replaceAll("'", "") // Remove the ''
            .split(',') // Split into individual IDs
            .map(artistId => artistId.trim()) // Trim whitespace
            .filter(artistId => validArtistIds.has(artistId)); // Filter out any artist id's that are not in processed artists.csv
        
        for (const artistId of artistIds) {
            trackArtistPairs.push({ track_id: trackId, artist_id: artistId });
        }
    }

    // Define CSV headers
    const csvWriter = createCsvWriter({
        path: fullPath,
        header: [
            { id: 'track_id', title: 'track_id' },
            { id: 'artist_id', title: 'artist_id' }
        ]
    });

    try {
        await csvWriter.writeRecords(trackArtistPairs);
        console.log(`Track-artist relationship data saved to CSV at ${fullPath}`);
    } catch (err) {
        console.error(`Error saving track-artist relationship data to CSV: ${err}`);
    }
};

module.exports = {
    saveDataToCsv,
    saveTrackToArtistsCsv,
    downloadDataAndUnzip,
    saveProcessedData
};