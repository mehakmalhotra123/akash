const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

let cachedSecrets = null;

async function getAwsConfig() {
    try {
        if (!cachedSecrets && process.env.AWS_SECRET_NAME) {
            const sm = new AWS.SecretsManager({ region: process.env.AWS_REGION });
            const secretData = await sm
                .getSecretValue({ SecretId: process.env.AWS_SECRET_NAME })
                .promise();

            cachedSecrets = JSON.parse(secretData.SecretString);

            return {
                accessKeyId: cachedSecrets.AWS_ACCESS_KEY_ID,
                secretAccessKey: cachedSecrets.AWS_SECRET_ACCESS_KEY,
                region: cachedSecrets.AWS_REGION,
                bucketName: cachedSecrets.AWS_BUCKET_NAME,
            };
        }
    } catch (err) {
        console.warn("Secrets Manager not available, falling back to .env");
    }

    return {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucketName: process.env.AWS_BUCKET_NAME,
    };
}

async function getS3() {
    const config = await getAwsConfig();
    return new AWS.S3({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: config.region,
    });
}

module.exports = { getS3, getAwsConfig };
