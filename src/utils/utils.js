const adm_zip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dirPath) => {
    console.log('Checking if raw_data folder exits...');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`raw_data not found, created at: ${dirPath}`);
        return false;
    }
    return true;
};

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
    console.log('Removing dataset zip...');
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete ${filePath} || Error: `, err);
          reject(err);
          return;
        } 
        console.log(`Removed  ${filePath}.`);
        resolve();
      });
    });
};

module.exports = {
    ensureDirectoryExists,
    extractZip,
    deleteFile
};