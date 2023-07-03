import { model, Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    zip: Number,
    street: String,
    country: String,
    paid: Boolean,
    ship: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model("Order", OrderSchema);
