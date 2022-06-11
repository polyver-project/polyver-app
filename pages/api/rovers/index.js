import db from "../../../db";

export default async function (req, res) {
  // filter API requests by method
  if (req.method === "GET") {
    const params = {
      TableName: process.env.DB_TABLENAME,
      IndexName: "isinfo-index",
    };

    db.scan(params, function (err, data) {
      if (err) {
        res.status(err).json({});
      } else {
        // send the json response from the callback
        res.status(200).json(data);
      }
    });
  } else if (req.method === "PUT") {
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
