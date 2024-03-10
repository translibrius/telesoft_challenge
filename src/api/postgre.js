require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const executeSqlFile = async (filePath) => {
    try {
        const fullPath = path.join(__dirname, filePath);
        const sqlString = fs.readFileSync(fullPath, { encoding: 'utf-8' });
        const client = await pool.connect();
        await client.query(sqlString);
        console.log(`${filePath} executed successfully.`);
        client.release();
    } catch (err) {
        console.error(`Error executing ${filePath}:`, err);
    }
};

const copyFromCSV = async (csvFilePath, tableName) => {
    const client = await pool.connect();

    try {
        const copyCommand = `COPY ${tableName} FROM '${csvFilePath}' WITH CSV HEADER`;
        await client.query(copyCommand);
        console.log(`Successfully loaded data into ${tableName} from ${csvFilePath}.`);
    } catch (error) {
        if (error.code === '23505' && error.detail.includes('already exists')) {
            console.log(`Table ${tableName} has data that conflicts.
            Consider clearing this table and restarting this script. Err: ${error.detail}`);
        } else {
            console.error('Error during the copy operation:', error);
        }
    } finally {
        client.release();
    }
};

const insertArtistsFromCSV = async () => {
    const artistsCsvPath = path.join(__dirname, '../../processed_data/artists.csv');
    await copyFromCSV(artistsCsvPath, 'artists');
};

const insertTracksFromCSV = async () => {
    const tracksCsvPath = path.join(__dirname, '../../processed_data/tracks.csv');
    await copyFromCSV(tracksCsvPath, 'tracks');
};

const insertTrackToArtistsFromCsv = async () => {
    const tracksCsvPath = path.join(__dirname, '../../processed_data/track_artists.csv');
    await copyFromCSV(tracksCsvPath, 'track_artists');
};

// Basic tables with no schema
const initDb = async () => {
    console.log('Initializing postgres db & setting up schema...');
    await executeSqlFile('../sql/create_artists_table.sql');
    await executeSqlFile('../sql/create_tracks_table.sql');

    // Junction table
    await executeSqlFile('../sql/create_tracks_artists_table.sql');
    console.log('Postgres table creation process complete!');
};

const disconnectDb = async () => {
    console.log('Disconnecting postgres pool');
    await pool.end();
};

module.exports = {
    initDb,
    insertArtistsFromCSV,
    insertTracksFromCSV,
    insertTrackToArtistsFromCsv,
    disconnectDb,
};