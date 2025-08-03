import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Bag from "./pages/Bag";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

import Settings from "./pages/user/Settings";
import UserOrders from "./pages/user/Orders";

import Dashboard from "./pages/vendor/Dashboard";
import VendorOrders from "./pages/vendor/Orders";
import Items from "./pages/vendor/Items";
import EditItem from "./pages/vendor/EditItem";
import AddItem from "./pages/vendor/AddItem";

import About from "./pages/menu/About";

import Clothing from "./pages/categories/Clothing";
import Jewellery from "./pages/categories/Jewellery";
import Handicrafts from "./pages/categories/Handicrafts";
import Books from "./pages/categories/Books";
import Accessories from "./pages/categories/Accessories";
import Houseware from "./pages/categories/Houseware";

import PinkCity from "./pages/markets/pinkcity/PinkCity";
import Shop1 from "./pages/markets/pinkcity/Shop1";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Error from "./pages/Error";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          <Route path="/user/settings" element={<Settings />} />
          <Route path="/user/orders" element={<UserOrders />} />

          <Route path="/vendor/dashboard" element={<Dashboard />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/items" element={<Items />} />
          <Route path="/vendor/items/edit" element={<EditItem />} />
          <Route path="/vendor/items/add" element={<AddItem />} />

          <Route path="/categories/clothing" element={<Clothing />} />
          <Route path="/categories/jewellery" element={<Jewellery />} />
          <Route path="/categories/handicrafts" element={<Handicrafts />} />
          <Route path="/categories/books" element={<Books />} />
          <Route path="/categories/accessories" element={<Accessories />} />
          <Route path="/categories/houseware" element={<Houseware />} />

          <Route path="/markets/pinkcity_bazaar" element={<PinkCity />} />
          <Route path="/markets/pinkcity_bazaar/shop1" element={<Shop1 />} />

          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </Router>
    </React.StrictMode>
  );
}

export default App;
