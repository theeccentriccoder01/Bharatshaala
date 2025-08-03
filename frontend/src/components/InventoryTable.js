import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState(null);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        getInventoryData();
        getOrderData();
    }, []);

    function getInventoryData() {
        axios({
            method: "GET",
            url: "/inventory",
        })
            .then((response) => {
                setInventoryData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    function getOrderData() {
        axios({
            method: "GET",
            url: "/orderData",
        })
            .then((response) => {
                setOrderData(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }

    return (
        <React.StrictMode>
            <div>
                <br />
                <h2 className="font-bharatshaala text-2xl relative left-2 bottom-1">Current Inventory</h2>
                <table className="font-body text-lg border-collapse border border-gray-400 w-1/2">
                    <thead>
                        <tr className="bg-brsl_mahogany text-white">
                            <th className="border p-3 border-solid border-[#ddd] text-left">Product Name</th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Product Description</th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Available Units </th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData !== null && JSON.parse(inventoryData).map((item, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff' }}>
                                <td className="border border-solid border-[#ddd] p-2">{item.ItemName}</td>
                                <td className="border border-solid border-[#ddd] p-2">{item.ItemDesc}</td>
                                <td className="border border-solid border-[#ddd] p-2">{item.Quantity}</td>
                                <td className="border border-solid border-[#ddd] p-2">₹{item.Price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table>

                </table>

                <br />
                <h2 className="font-bharatshaala text-2xl relative left-2 bottom-1">Product Sales</h2>
                <table className="font-body text-lg border-collapse border border-gray-400 w-1/2">
                    <thead>
                        <tr className="bg-brsl_mahogany text-white">
                            <th className="border p-3 border-solid border-[#ddd] text-left">Product Name</th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Rate</th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Units Sold</th>
                            <th className="border p-3 border-solid border-[#ddd] text-left">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {console.log(orderData)}
                        {console.log(typeof orderData)}
                        {orderData !== null && orderData.map((item, index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#fff' }}>
                                <td className="border border-solid border-[#ddd] p-2">{item.ItemName}</td>
                                <td className="border border-solid border-[#ddd] p-2">{item.Price}</td>
                                <td className="border border-solid border-[#ddd] p-2">{item.Quantity}</td>
                                <td className="border border-solid border-[#ddd] p-2">₹{item.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </React.StrictMode>
    );
};

export default InventoryTable;
