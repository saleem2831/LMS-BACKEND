import { S3Client } from "@aws-sdk/client-s3";
import { ENV } from "../config/env.js";


const s3 = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_KEY
  }
});

export default s3;