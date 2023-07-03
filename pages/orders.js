import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  async function ShippedChange(id, shippedStatus) {
    await axios
      .put("/api/orders", {
        _id: id,
        ship: shippedStatus,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    axios
      .get("/api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => console.log(error));
  }, [orders]);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr className="text-left">
            <td>Date</td>
            <td>Paid</td>
            <td>Recipient</td>
            <td>Products</td>
            <td>Shipped</td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="border border-top">
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "Yes" : "No"}
                </td>
                <td>
                  <strong>{order.name}</strong> {order.email}
                  <br />
                  {order.street}
                  <br />
                  {order.city} {order.zip} {order.country}
                </td>
                <td>
                  {/* need to add key to map below */}
                  {order.line_items.map((item) => (
                    <>
                      {item.price_data.product_data.name} x {item.quantity}
                      <br />
                    </>
                  ))}
                </td>
                <td>
                  {order?.ship === true ? (
                    <button
                      className="btn-layer text-green-600"
                      onClick={() => {
                        ShippedChange(order._id, false);
                      }}
                    >
                      Yes
                    </button>
                  ) : (
                    <button
                      className="btn-layer text-red-600"
                      onClick={() => {
                        ShippedChange(order._id, true);
                      }}
                    >
                      No
                    </button>
                  )}
                </td>
                <td>{new Date(order?.updatedAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
        </tbody>
      </table>
    </Layout>
  );
}
