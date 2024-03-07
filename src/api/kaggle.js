/*
    USES KAGGLE.COM PUBLIC API TO DOWNLOAD SPOTIFY DATASET
    CAN BE REUSED FOR OTHER DATASET DOWNLOADS
    https://github.com/Kaggle/kaggle-api
*/

require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const KAGGLE_USERNAME = process.env.KAGGLE_USERNAME;
const KAGGLE_KEY = process.env.KAGGLE_KEY;
const KAGGLE_BASE_URL = 'https://www.kaggle.com/api/v1/datasets/download/';

// Basic auth token (Kaggle API)
const getBasicAuthToken = (username, key) => {
    return 'Basic ' + Buffer.from(`${username}:${key}`).toString('base64');
  };
  
const downloadDataset = async (datasetUrl, savePath) => {
    const url = KAGGLE_BASE_URL + datasetUrl;

    const options = {
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: {
        'Authorization': getBasicAuthToken(KAGGLE_USERNAME, KAGGLE_KEY)
        }
    };

    try {
        const response = await axios(options);
        const totalLength = response.headers['content-length'];
        console.log(`Total size: ${(totalLength / 1024 / 1024).toFixed(2)} MB`);

        const writer = fs.createWriteStream(path.resolve(savePath));
        let downloadedLength = 0;

        response.data.on('data', (chunk) => {
            downloadedLength += chunk.length;
            const percentage = (downloadedLength / totalLength * 100).toFixed(2);
            process.stdout.write(`Downloading... ${percentage}%\r`);
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            // Clear the line and print the final message.
            process.stdout.write("\r\x1b[K");
            console.log('Download finished!');
            resolve();
        });
        writer.on('error', reject);
        });
    } catch (error) {
        console.error('Failed to download dataset:', error);
    }
};

module.exports = {
    downloadDataset,
};