const AWS = require("aws-sdk");
const uuid = require("uuid");
const requireLogin = require("../middlewares/requireLogin");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  region: "us-east-2",
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

module.exports = (app) => {
  app.get("/api/upload", requireLogin, async (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "blog-bucket-1990",
        Key: key,
        ContentType: "image/jpeg",
      },
      (err, url) => {
        res.send({ key, url });
      }
    );
  });
};
