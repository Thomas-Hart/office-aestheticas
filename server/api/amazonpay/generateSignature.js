import { AmazonPayClient } from '@amazonpay/amazon-pay-api-sdk-nodejs';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    // console.log('Received request body:', JSON.stringify(body));

    const payload = body.payload;
    if (!payload) {
      console.error('Error: Payload is missing in the request.');
      return { error: 'Payload is required' };
    }

    const runtimeConfig = useRuntimeConfig();
    // console.log('Runtime configuration:', JSON.stringify(runtimeConfig));

    const config = {
      publicKeyId: runtimeConfig.AMAZON_PAY_PUBLIC_KEY_ID,
      privateKey: fs.readFileSync(runtimeConfig.private.AMAZON_PAY_PRIVATE_KEY_PATH),
      region: runtimeConfig.AMAZON_PAY_REGION || 'US',
      sandbox: runtimeConfig.AMAZON_PAY_SANDBOX !== 'false',
      algorithm: 'AMZN-PAY-RSASSA-PSS-V2',
    };
    // console.log('Amazon Pay client configuration:', JSON.stringify(config));

    const client = new AmazonPayClient(config);
    // console.log('AmazonPayClient initialized successfully.');

    const signature = client.generateButtonSignature(payload);
    // console.log('Generated signature:', signature);

    return { signature };
  } catch (error) {
    console.error('Error generating signature:', error);
    return { error: `Error generating signature: ${error.message}` };
  }
});
