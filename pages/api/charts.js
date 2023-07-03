import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

/* 
One function to handle different data requests?

Bar: 
Sessions:
Popular Item:
Unfulfilled orders: pie chart?

*/

export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === "GET") {
    if (req.query?.chart === "bar") {
      res.json(
        await Order.find({
          createdAt: {
            $lte: new Date(),
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000),
          },
        })
      );
    }

    // querying for all items in orders and count each one
    if (req.query?.chart === "line") {
      const data = await Order.find();
      const productData = [];
      // for loops to get all product names in order
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].line_items.length; j++) {
          productData.push(data[i].line_items[j].price_data.product_data.name);
        }
      }

      res.json(productData);
    } else {
      res.json("nothing here");
    }
  } else {
    res.json("dummy");
  }
}
