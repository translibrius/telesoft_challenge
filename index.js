const saver = require('./src/io/save_data');
const postgres = require('./src/api/postgre');

const parsing = require('./src/io/parse');

// AWS
const aws_api = require('./src/api/aws');
const bucket = process.env.AWS_S3_BUCKET_NAME;

const main = async () => {
    try {
        // Download dataset from kaggle
        await saver.downloadDataAndUnzip();

        // Process data
        var { filteredTracks, filteredArtists } = await parsing.parseDataset();

        // Save processed data
        await saver.saveProcessedData(filteredTracks, filteredArtists);
        
        // Upload processed data to AWS S3
        await aws_api.uploadFile(bucket, 'artists', './processed_data/artists.csv');
        await aws_api.uploadFile(bucket, 'tracks', './processed_data/tracks.csv');

        // Postgre init and create tables
        await postgres.initDb();

        // Queries
        await postgres.insertArtistsFromCSV();
        await postgres.insertTracksFromCSV();
        await postgres.insertTrackToArtistsFromCsv();

        // Disconnect from postgres & stop
        await postgres.disconnectDb();
        
        console.log('Finished! DB is ready to use! Exiting main script...');
    } catch (error) {
        console.error('Error in main execution flow: ', error);
    }
};

main();
