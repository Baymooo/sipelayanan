const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1'
});

const uploadToS3 = async (file, fileName) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  });
  await s3Client.send(command);
  // WAJIB return CloudFront URL, bukan URL S3 langsung
  return `${process.env.CLOUDFRONT_URL}/${fileName}`;
};

module.exports = { s3Client, uploadToS3 };
