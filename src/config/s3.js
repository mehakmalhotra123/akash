require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // set in .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // set in .env
    region: process.env.AWS_REGION                  // e.g. ap-south-1
});

console.log("Bucket:", process.env.AWS_BUCKET_NAME);
console.log("S3 client:", s3);

module.exports = s3;