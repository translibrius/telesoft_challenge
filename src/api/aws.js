require('dotenv').config();

const fs = require('node:fs');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_IAM_SECRET_ACCESS_KEY,
    region: process.env.AWS_IAM_REGION
});

const S3 = new AWS.S3();

const uploadFile = (bucketName, s3_fileName, filePath) => {
    console.log(`Uploading ${s3_fileName} to AWS S3`);
    const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: bucketName,
        Key: s3_fileName,
        Body: fileContent,
        ContentType: 'application/json'
    };

    // Uploading files to the bucket
    return new Promise((resolve, reject) => {
        S3.upload(params, function(err, data) {
            if (err) {
                console.error(`Error uploading ${s3_fileName} to AWS S3`);
                reject(err);
            } else {
                console.log(`File uploaded successfully. ${data.Location}`);
                resolve(data);
            }
        });
    });
};

module.exports = {
    uploadFile
};