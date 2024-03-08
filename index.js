const kaggle_api = require('./src/api/kaggle');
const utils = require('./src/utils/utils');

const parsing = require('./src/parsing/parse');

const kaggleDatasetUrl = 'yamaerenay/spotify-dataset-19212020-600k-tracks';

const zipFilePath = './raw_data/dataset.zip';
const extractToPath = './raw_data/';

const downloadDataAndUnzip = async () => {
    try {
        data_exists = utils.ensureDirectoryExists('./raw_data');

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
        // Todo: Use filtered data for aws
    } catch (error) {
        console.error('Error in main execution flow: ', error);
    }
};

main();
