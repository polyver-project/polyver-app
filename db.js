import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  region: "us-west-1",
});

const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

export default db;
