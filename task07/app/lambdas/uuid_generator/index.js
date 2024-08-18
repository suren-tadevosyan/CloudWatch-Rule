import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client();
const BUCKET_NAME = process.env.BUCKET_NAME || "uuid-storage";

export const handler = async (event, context) => {
  const timestamp = new Date().toISOString();
  const fileName = `${timestamp}.json`;

  const ids = Array.from({ length: 10 }, () => uuidv4());

  const fileContent = JSON.stringify({ ids }, null, 2);

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: "application/json",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    console.log(`File ${fileName} created successfully.`);
  } catch (err) {
    console.error(`Error uploading file ${fileName}:`, err);
    throw new Error(`Error uploading file ${fileName}`);
  }
  return { statusCode: 200, body: "Success" };
};
