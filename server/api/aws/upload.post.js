import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Create an S3 client using runtime config values
  const s3 = new S3Client({
    region: config.NUXT_AWS_REGION,
    credentials: {
      accessKeyId: config.NUXT_AWS_ACCESS_KEY,
      secretAccessKey: config.NUXT_AWS_SECRET_KEY,
    },
  });

  // Read the multipart form data
  const formData = await readMultipartFormData(event);
  const file = formData[0]; // Assuming the file is the first element in the formData array

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded',
    });
  }

  // Use file.data instead of file.filepath
  const fileContent = file.data; // This is the file buffer

  const params = {
    Bucket: config.NUXT_S3_BUCKET, // S3 bucket name from config
    Key: `${Date.now()}_${file.filename}`, // Unique file name using current timestamp and original filename
    Body: fileContent, // Buffer content
    ContentType: file.mimetype, // Content type (e.g., image/jpeg, image/png)
    // Removed ACL field as it is not allowed in the current bucket configuration
  };

  try {
    // Upload the file to S3
    const data = await s3.send(new PutObjectCommand(params));
    const s3Url = `https://${config.NUXT_S3_BUCKET}.s3.${config.NUXT_AWS_REGION}.amazonaws.com/${params.Key}`;
    return { url: s3Url }; // Return the S3 URL
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Upload failed: ' + error.message,
    });
  }
});
