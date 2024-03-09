const fs = require('node:fs');
const utils = require('../utils/utils');

const saveDataToJson = async (data, path, filename) => {
    await utils.ensureDirectoryExists(path);

    try {
        fs.writeFileSync(path+filename, JSON.stringify(data, null));
    } catch (err) {
        console.error(`Error saving data to JSON: ${err}`);
    }
};

module.exports = {
    saveDataToJson
};