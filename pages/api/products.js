import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();
  // checking for admin session
  await isAdminRequest(req, res);
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, stock, images, category, properties } =
      req.body;
    const productDoc = await Product.create({
      title: title,
      description: description,
      price: price,
      stock: stock,
      images: images,
      category: category,
      properties: properties,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {
      _id,
      title,
      description,
      price,
      stock,
      images,
      category,
      properties,
    } = req.body;
    await Product.updateOne(
      { _id: _id },
      {
        title: title,
        description: description,
        price: price,
        stock: stock,
        images: images,
        category: category,
        properties: properties,
      }
    );
    res.json("Item Updated");
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json("Item Deleted");
    }
  }
}
