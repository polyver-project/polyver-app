import db from "../../../../db";
import { getSession } from "next-auth/react";

export default async function (req, res) {
  const name = req.query.name;
  // filter API requests by method
  if (req.method === "GET") {
    const params = {
      TableName: process.env.DB_TABLENAME,
      Key: {
        pk: name,
        sk: "info",
      },
    };

    db.get(params, function (err, data) {
      if (err) {
        res.status(err).json({});
      } else {
        // send the json response from the callback
        res.status(200).json(data);
      }
    });
  } else if (req.method === "POST") {
    const session = await getSession({ req });
    const timestamp = new Date().getTime();
    const params = {
      TableName: process.env.DB_TABLENAME,
      Item: {
        pk: name,
        sk: `queue_${timestamp}`,
        user_id: session.user.email,
      },
    };

    if (session) {
      db.put(params, function (err, data) {
        if (err) {
          res.status(err).json({});
        } else {
          // send the json response from the callback
          data["timestamp"] = timestamp;
          res.send(JSON.stringify(data, null, 2));
        }
      });
    } else {
      res.send({
        error:
          "You must be sign in to view the protected content on this page.",
      });
    }
  } else if (req.method === "DELETE") {
    const timestamp = req.body.timestamp;
    const params = {
      TableName: process.env.DB_TABLENAME,
      Key: {
        pk: name,
        sk: `queue_${timestamp}`,
      },
    };

    db.delete(params, function (err, data) {
      if (err) {
        res.status(err).json({});
      } else {
        res.status(200).json(data);
      }
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
