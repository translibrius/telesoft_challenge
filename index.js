const kaggle_api = require('./src/api/kaggle');
kaggle_api.downloadDataset('yamaerenay/spotify-dataset-19212020-600k-tracks', './raw_data/dataset.zip');
