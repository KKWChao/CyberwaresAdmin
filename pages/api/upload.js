import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = process.env.S3_BUCKET_NAME;

export default async function handle(req, res) {
  // checking for admin session
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();

  // get image from the form upload
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      resolve({ fields, files });
    });
  });
  console.log("length:", files.file?.length);

  // Connecting to S3
  const client = new S3Client({
    region: "us-west-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const links = [];
  // loop to upload file with different name
  for (const file of files.file) {
    // grabs the extension by splitting and using pop to return the element at the end
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;

    // sending the files
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
