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

// Filters out non unique data from an array by checking data.id
function ensureUnique(data) {
    const seenIds = new Set();
    let duplicateCount = 0;

    const uniqueData = data.filter(item => {
        if (seenIds.has(item.id)) {
            duplicateCount += 1;
            return false; // duplicate found
        } else {
            seenIds.add(item.id);
            return true;
        }
    });

    console.log(`Found and removed ${duplicateCount} duplicate(s).`);
    return {
        uniqueData
    };
}

// Replaces [ ] with { } and removes any " found.
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
    ensureUnique,
    formatStringArrayForPostgres,
    deleteFile,
};