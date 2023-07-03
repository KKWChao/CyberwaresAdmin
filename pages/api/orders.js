import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === "PUT") {
    const { _id, ship } = req.body;
    await Order.updateOne(
      { _id: _id },
      {
        ship: ship,
      }
    );
    res.json(true);
    return;
  }

  res.json(await Order.find().sort({ createdAt: -1 }));
}
