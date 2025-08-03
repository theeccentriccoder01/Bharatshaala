import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

const VendorOrders = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Fetch order data when the component mounts
    getOrderData();
  }, []);

  function getOrderData() {
    axios({
      method: "GET",
      url: "/CustomerOrder",
    })
      .then((response) => {
        // Convert object of orders into an array
        const dataArray = Object.keys(response.data).map((key) => ({
          order_id: key,
          ...response.data[key],
        }));
        setOrderData(dataArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <React.StrictMode>
      <div className="bg-brsl_cream h-full min-h-screen">
        {/* Main text */}
        <div className="max-w-lg mx-auto">
          <h1 className="flex"></h1>
          <h1 className="flex text-brsl_brick font-bharatshaala text-6xl mt-5 justify-center text-center">
            Vendor Center
          </h1>
        </div>

        <div className="flex">
          <div className="w-1/3 md:w-1/4 h-56 md:h-64 mt-5 mx-4 group flex relative bg-brsl_brick p-5 rounded-2xl">
            <div className="font-body text-white text-left z-10 px-2">
              <a
                href="/vendor/dashboard"
                className="text-lg md:text-xl leading-tight"
              >
                Dashboard
              </a>
              <h6 className="text-sm">
                <span>&#8203;</span>
              </h6>
              <a
                href="/vendor/orders"
                className="text-lg md:text-xl leading-tight"
              >
                Orders List
              </a>
              <h6 className="text-sm">
                <span>&#8203;</span>
              </h6>
              <a
                href="/vendor/items"
                className="text-lg md:text-xl leading-tight"
              >
                Manage Items
              </a>
              <h6 className="text-sm">
                <span>&#8203;</span>
              </h6>
              <a href="/login" className="text-lg md:text-xl leading-tight">
                Log Out
              </a>
            </div>
          </div>
          <div className="w-2/3 md:w-3/4 mt-5 px-2 rounded-2xl">
            <div className="font-body text-brsl_brick text-left z-10 px-2">
              <h2 className="font-bharatshaala text-4xl sm:text-3xl px-1">
                Orders List
              </h2>
            </div>

            {/* Items */}
            <div className="grid gap-5 p-3">
              {/* Map through order data and render each order */}
              {orderData.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between relative bg-white p-5 rounded-2xl"
                >
                  <div className="text-gray-600">
                    <a href="#" className="font-bharatshaala text-xl ml-5">
                      Order #{order.order_id}
                    </a>
                    <p className="font-body text-md ml-5">Order Details:</p>
                    {/* Render details of each order */}
                    <div className="ml-5">
                      <p>Item: {order.ItemName}</p>
                      <p>Price: {order.Price}</p>
                      <p>Quantity: {order.Quantity}</p>
                      <p>Date: {order.Date}</p>
                      <p>Customer Email: {order.CustomerContact}</p>
                    </div>
                  </div>
                  <h1 className="font-bharatshaala text-2xl text-gray-800 relative bottom-0.5 right-2">
                    ₹{order.Price * order.Quantity}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        </div>
        <br></br>
      </div>
    </React.StrictMode>
  );
};

export default VendorOrders;
