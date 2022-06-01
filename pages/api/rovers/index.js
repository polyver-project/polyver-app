import db from "../../../db";

export default async function (req, res) {
  // filter API requests by method
  if (req.method === "GET") {
    // Allow a blog post to get its number of likes and views
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
    // Allow a blog post to update its likes (via a button) or views (on rendering)
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
