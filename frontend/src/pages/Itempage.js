import React from "react";
import { useEffect, useState } from "react";
import "./itempage.css";
import axios from "axios";

console.log(axios.isCancel('something'));

const ItemPage = () => {
  const [profileData, setProfileData] = useState(null);
  function getData() {
    axios({
      method: "GET",
      url: "/Item",
    })
      .then((response) => {
        const res = response.data;
        setProfileData({
          profile_name: res.name,
          about_me: res.about,
        });
        console.log(profileData);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", price: 10 },
    { id: 2, name: "Item 2", price: 20 },
    { id: 3, name: "Item 3", price: 30 },
    // Add more items here as needed
  ]);

  const addToCart = (item) => {
    // Add your addToCart logic here
    console.log("Item added to cart:", item);
  };
  return (
    <div>
      <h1>Items</h1>
      <div className="item-container">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <h2>{item.name}</h2>
            <p>${item.price}</p>
            <button onClick={() => getData()}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemPage;
