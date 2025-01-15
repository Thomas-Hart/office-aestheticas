import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

  // Extract the key of the file to delete from the request body
  const body = await readBody(event);
  const { key } = body;

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file key provided',
    });
  }

  const params = {
    Bucket: config.NUXT_S3_BUCKET, // S3 bucket name from config
    Key: key, // The key (path) of the object to delete
  };

  try {
    // Delete the file from S3
    await s3.send(new DeleteObjectCommand(params));
    return { message: 'File deleted successfully' };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Delete failed: ' + error.message,
    });
  }
});
