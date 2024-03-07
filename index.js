const kaggle_api = require('./src/api/kaggle');
const utils = require('./src/utils/utils');

const kaggleDatasetUrl = 'yamaerenay/spotify-dataset-19212020-600k-tracks';

const zipFilePath = './raw_data/dataset.zip';
const extractToPath = './raw_data/';

const downloadAndProcessDataset = async () => {
    try {
        await kaggle_api.downloadDataset(kaggleDatasetUrl, zipFilePath);
        await utils.extractZip(zipFilePath, extractToPath);
        await utils.deleteFile(zipFilePath);
    } catch (error) {
        console.error('Error while downloading or processing dataset from kaggle: ', error);
    }
};

downloadAndProcessDataset();
