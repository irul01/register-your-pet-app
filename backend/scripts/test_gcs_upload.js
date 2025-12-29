const path = require('path');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

async function main() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const bucketName = process.env.GCP_UPLOADS_BUCKET;
  if (!keyFile) {
    console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service account JSON path');
    process.exit(2);
  }
  if (!bucketName) {
    console.error('Set GCP_UPLOADS_BUCKET to the target bucket name');
    process.exit(2);
  }

  const storage = new Storage({ keyFilename: keyFile });

  // Try to find a small sample file in the repo
  const sample = path.resolve(__dirname, '../../frontend/pet-registration-frontend/public/register-animal.pdf');
  const fallback = path.resolve(__dirname, '../../frontend/pet-registration-frontend/public/vite.svg');
  const filePath = fs.existsSync(sample) ? sample : fallback;
  if (!fs.existsSync(filePath)) {
    console.error('No sample file found to upload:', filePath);
    process.exit(2);
  }

  const filename = `tests/${Date.now()}-${path.basename(filePath)}`;
  console.log('Uploading', filePath, 'to', bucketName, 'as', filename);

  const bucket = storage.bucket(bucketName);
  await bucket.upload(filePath, { destination: filename, public: true });

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(filename)}`;
  console.log('Uploaded. Public URL:', publicUrl);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
