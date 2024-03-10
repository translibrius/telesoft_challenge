const adm_zip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = async (dirPath) => {
    console.log(`Checking if ${dirPath} exits...`);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory not found, created at: ${dirPath}`);
        return false;
    }
    console.log(`${dirPath} exists, proceeding...`);
    return true;
};

const allFilesExist = (dirPath, files) => {
    return files.every(file => {
        const filePath = path.join(dirPath, file);
        return fs.existsSync(filePath);
    });
};

// Extracts the downloaded dataset.zip from kaggle using adm_zip module
const extractZip = (zipFilePath, extractToPath) => {
    console.log('Extracting dataset...');
    return new Promise((resolve, reject) => {
        try {
            const zip = new adm_zip(zipFilePath);
            zip.extractAllToAsync(extractToPath, true, (err) => {
                if (err) reject(err);

                console.log(`Finished extracting ${zipFilePath}!`);
                resolve();
            });
        } catch (error) {
            reject(error);
        }
    });
};

const deleteFile = (filePath) => {
    console.log(`Deleting ${filePath}...`);
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete ${filePath} || Error: `, err);
          reject(err);
          return;
        } 
        console.log(`Deleted  ${filePath}.`);
        resolve();
      });
    });
};

// Replaces [ ] with { } and removes any " found.
// Postgres only accepts arrays with {}
const formatStringArrayForPostgres = (arrayString) => {
    if (arrayString.startsWith('[') && arrayString.endsWith(']')) {
        arrayString = '{' + arrayString.substring(1, arrayString.length - 1) + '}';
    }

    arrayString = arrayString.replaceAll(/"/g, '');
    return arrayString;
};

module.exports = {
    ensureDirectoryExists,
    allFilesExist,
    extractZip,
    formatStringArrayForPostgres,
    deleteFile,
};