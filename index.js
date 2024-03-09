const kaggle_api = require('./src/api/kaggle');
const utils = require('./src/utils/utils');
const saver = require('./src/io/save_data');
const postgres = require('./src/api/postgre');

const parsing = require('./src/io/parse');

const kaggleDatasetUrl = 'yamaerenay/spotify-dataset-19212020-600k-tracks';

const zipFilePath = './raw_data/dataset.zip';
const extractToPath = './raw_data/';

// AWS
const aws_api = require('./src/api/aws');
const bucket = process.env.AWS_S3_BUCKET_NAME;

const downloadDataAndUnzip = async () => {
    try {
        data_exists = await utils.ensureDirectoryExists('./raw_data');

        if (!data_exists) {
            await kaggle_api.downloadDataset(kaggleDatasetUrl, zipFilePath);
            await utils.extractZip(zipFilePath, extractToPath);
            await utils.deleteFile(zipFilePath);
        } else {
            console.log('Found raw_data, skipping download...');
        }
    } catch (error) {
        console.error('Error while downloading or processing dataset from kaggle: ', error);
    }
};

const main = async () => {
    try {
        await downloadDataAndUnzip();

        const { filteredTracks, filteredArtists } = await parsing.parseDataset();

        await saver.saveDataToJson(filteredArtists, './processed_data/', 'artists.json');

        await saver.saveDataToJson(filteredTracks, './processed_data/', 'tracks.json');

        await aws_api.uploadFile(bucket, 'artists', './processed_data/artists.json');

        await aws_api.uploadFile(bucket, 'tracks', './processed_data/tracks.json');

        await postgres.initDb();
    } catch (error) {
        console.error('Error in main execution flow: ', error);
    }
};

main();
