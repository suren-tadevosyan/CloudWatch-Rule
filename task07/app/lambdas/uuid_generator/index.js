import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME || "uuid-storage";

export const handler = async () => {
  const executionStartTime = new Date();
  const executionTimeStr = executionStartTime.toISOString();
  const fileName = `${executionTimeStr}.json`;
  const uuidList = [];

  for (let i = 0; i < 10; i++) {
    uuidList.push(uuidv4());
  }

  const fileContent = JSON.stringify({ ids: uuidList }, null, 2);

  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: "application/json",
  };

  try {
    await s3.putObject(s3Params).promise();
    console.log(`Successfully uploaded ${fileName} to ${BUCKET_NAME}`);
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }

  return { statusCode: 200, body: "Success" };
};
