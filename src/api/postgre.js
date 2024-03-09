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

const initDb = async () => {
    await executeSqlFile('../sql/create_artists_table.sql');
    await executeSqlFile('../sql/create_tracks_table.sql');
};

module.exports = {
    initDb,
};