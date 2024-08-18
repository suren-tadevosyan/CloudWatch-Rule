import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME || "uuid-storage";

export const handler = async (event) => {
  const ids = Array.from({ length: 10 }, () => uuidv4());

  const content = {
    ids: ids,
  };

  const jsonContent = JSON.stringify(content);

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${timestamp}.json`,
    Body: jsonContent,
    ContentType: "application/json",
  };

  try {
    await s3.putObject(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify("File created successfully."),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to create file."),
    };
  }
};
