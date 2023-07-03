import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Categories";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  // checking for admin session
  await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name: name,
      parent: parentCategory || undefined,
      properties: properties,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id: _id },
      {
        name: name,
        parent: parentCategory || undefined,
        properties: properties,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id: _id });
    res.json("Category deleted");
  }
}
