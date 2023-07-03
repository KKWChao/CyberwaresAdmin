import { model, Schema, models } from "mongoose";

// create model for order data
const OrderSchema = new Schema({});

export const OrderData = models.OrderSchema || model("OrderData", OrderSchema);
