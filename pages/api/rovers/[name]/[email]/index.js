import db from "../../../../../db";
import { getSession } from "next-auth/react";

export default async function (req, res) {
  const name = req.query.name;
  const email = req.query.email;
  // filter API requests by method
  if (req.method === "GET") {
    const session = await getSession({ req });
    const params = {
      TableName: process.env.DB_TABLENAME,
      IndexName: "queue_user",
      KeyConditionExpression: "pk = :pk and user_id = :user_id",
      ExpressionAttributeValues: {
        ":pk": name,
        ":user_id": email,
      },
    };

    if (session) {
      db.query(params, function (err, data) {
        if (err) {
          console.log(err);
          res.status(err).json({});
        } else {
          res.status(200).json(data);
        }
      });
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
