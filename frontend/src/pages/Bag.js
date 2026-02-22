import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import PaymentGateway from "../components/PaymentGateway";
import "../App.css";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const Bag = () => {
  const [profileData, setProfileData] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipCost, setShipCost] = useState(0);
  const [order_details, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [notification, setNotification] = useState(null);

  const deliveryOptions = [
    { id: 'standard', name: 'स्टैंडर्ड डिलीवरी', time: '5-7 दिन', cost: 0, description: 'मुफ्त डिलीवरी ₹999+ ऑर्डर पर' },
    { id: 'express', name: 'एक्सप्रेस डिलीवरी', time: '2-3 दिन', cost: 150, description: 'तेज़ डिलीवरी' },
    { id: 'overnight', name: 'ओवरनाइट डिलीवरी', time: '1 दिन', cost: 300, description: 'अगले दिन डिलीवरी' }
  ];

  const coupons = [
    { code: 'BHARATSHAALA10', discount: 10, minOrder: 1000, description: '10% छूट ₹1000+ ऑर्डर पर' },
    { code: 'FIRST25', discount: 25, minOrder: 500, description: '25% छूट पहले ऑर्डर पर' },
    { code: 'HERITAGE15', discount: 15, minOrder: 1500, description: '15% छूट हेरिटेज प्रोडक्ट्स पर' }
  ];

  useEffect(() => {
    Promise.all([
      getAmount(),
      makeOrder(),
      getShippingCost(),
      getData()
    ]).finally(() => {
      setTimeout(() => setLoading(false), 1000);
    });
  }, []);

  function getAmount() {
    return axios({
      method: "GET",
      url: "/getTotalAmount",
    })
      .then((response) => {
        setSubtotal(response.data.totalAmount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSubtotal(5000); // Mock data
      });
  }

  function handleChange(event, item) {
    const selectedValue = event.target.value;
    axios
      .post("/ChangeQuantity", { item, selectedValue })
      .then((response) => {
        getData();
        getAmount();
        showNotification('मात्रा अपडेट की गई', 'success');
      })
      .catch((error) => {
        showNotification('मात्रा अपडेट में समस्या', 'error');
      });
  }

  function removeItem(item) {
    axios
      .post("/RemoveFromCart", { item })
      .then((response) => {
        getData();
        getAmount();
        showNotification('आइटम हटा दिया गया', 'success');
      })
      .catch((error) => {
        showNotification('आइटम हटाने में समस्या', 'error');
      });
  }

  function getShippingCost() {
    return axios({
      method: "GET",
      url: "/getShippingCost",
    })
      .then((response) => {
        setShipCost(response.data.shippingCost);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setShipCost(100); // Mock data
      });
  }

  function getData() {
    return axios({
      method: "GET",
      url: "/Cart",
    })
      .then((response) => {
        const res = response.data;
        const profileDataArray = res.map((item) => ({
          store_Id: item[0],
          Item_Id: item[1],
          Customer_Id: item[2],
          Quantity: item[3],
          Price: item[4],
          ItemName: item[5],
          image: item[6] || '/images/items/earrings.jpg',
          description: item[7] || 'पारंपरिक हस्तनिर्मित उत्पाद',
          seller: item[8] || 'भारतशाला विक्रेता'
        }));

        setProfileData(profileDataArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Mock data for demo
        setProfileData([
          {
            store_Id: 1,
            Item_Id: 1,
            Customer_Id: 1,
            Quantity: 2,
            Price: 2500,
            ItemName: "कुंदन हार",
            image: '/images/items/kundan-necklace-1.jpg',
            description: 'पारंपरिक कुंदन और मीनाकारी से सजा हुआ खूबसूरत हार',
            seller: 'राजस्थानी रत्न भंडार'
          },
          {
            store_Id: 1,
            Item_Id: 2,
            Customer_Id: 1,
            Quantity: 1,
            Price: 1500,
            ItemName: "चांदी के झुमके",
            image: '/images/items/earrings.jpg',
            description: 'हाथ से बने चांदी के झुमके, मीनाकारी के साथ',
            seller: 'राजस्थानी रत्न भंडार'
          }
        ]);
      });
  }

  function makeOrder() {
    return axios({
      method: "GET",
      url: "/createOrder",
    })
      .then((response) => {
        setOrderDetails(response.data);
        setupRazorpay(response.data);
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  }

  function applyCoupon() {
    const coupon = coupons.find(c => c.code === couponCode);
    if (coupon && subtotal >= coupon.minOrder) {
      setDiscount((subtotal * coupon.discount) / 100);
      showNotification(`कूपन लागू! ${coupon.discount}% छूट मिली`, 'success');
    } else {
      showNotification('अमान्य कूपन कोड या न्यूनतम ऑर्डर पूरा नहीं', 'error');
    }
  }

  function showNotification(message, type) {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function setupRazorpay(orderData) {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const finalAmount = subtotal - discount + getDeliveryCost();
    
    const options = {
      key: "rzp_test_BXNSan3NdLPrPa",
      amount: (finalAmount * 100).toString(),
      currency: "INR",
      name: "भारतशाला",
      description: "पारंपरिक भारतीय उत्पादों की खरीदारी",
      image: "/favicon.ico",
      order_id: orderData?.id,
      callback_url: "/authenticate",
      prefill: {
        name: "ग्राहक",
        email: "customer@bharatshaala.com",
        contact: "9999999999"
      },
      theme: {
        color: "#059669",
      },
    };

    const rzp1 = new window.Razorpay(options);
    document.getElementById("checkout-button").onclick = function (e) {
      rzp1.open();
      e.preventDefault();
    };
  }

  function getDeliveryCost() {
    const option = deliveryOptions.find(opt => opt.id === deliveryOption);
    return subtotal >= 999 && deliveryOption === 'standard' ? 0 : option?.cost || 0;
  }

  const finalTotal = subtotal - discount + getDeliveryCost();

  if (loading) {
    return <LoadingSpinner message="आपका शॉपिंग बैग लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-fade-in`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-200 mb-4'>
              शॉपिंग बैग
            </h1>
            <p className='text-xl text-emerald-600 dark:text-emerald-400 max-w-2xl mx-auto'>
              आपकी यात्रा से चुने गए आइटम्स देखें और जो चाहिए उन्हें चेकआउट के लिए तैयार करें
            </p>
          </div>

          {profileData && profileData.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              
              {/* Cart Items */}
              <div className='lg:col-span-2 space-y-6'>
                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
                  <h2 className='text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6 flex items-center space-x-3'>
                    <span>🛍️</span>
                    <span>आपके आइटम्स ({profileData.length})</span>
                  </h2>
                  
                  <div className='space-y-4'>
                    {profileData.map((item, index) => (
                      <CartItem 
                        key={index}
                        item={item}
                        onQuantityChange={handleChange}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
                  <h3 className='text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center space-x-2'>
                    <span>🚚</span>
                    <span>डिलीवरी विकल्प</span>
                  </h3>
                  
                  <div className='space-y-3'>
                    {deliveryOptions.map((option) => (
                      <label key={option.id} className='flex items-center space-x-3 p-4 border border-emerald-200 dark:border-emerald-700 rounded-xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-200'>
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={deliveryOption === option.id}
                          onChange={(e) => setDeliveryOption(e.target.value)}
                          className="text-emerald-600 dark:text-emerald-400"
                        />
                        <div className='flex-1'>
                          <div className='flex justify-between items-center'>
                            <span className='font-semibold text-emerald-800 dark:text-emerald-200'>{option.name}</span>
                            <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                              {option.cost === 0 ? 'मुफ्त' : `₹${option.cost}`}
                            </span>
                          </div>
                          <div className='text-emerald-600 dark:text-emerald-400 text-sm'>{option.time} • {option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Coupon Section */}
                <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
                  <h3 className='text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center space-x-2'>
                    <span>🎫</span>
                    <span>कूपन कोड</span>
                  </h3>
                  
                  <div className='flex gap-3 mb-4'>
                    <input
                      type="text"
                      placeholder="कूपन कोड डालें"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      लागू करें
                    </button>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>उपलब्ध कूपन:</p>
                    {coupons.map((coupon, index) => (
                      <div key={index} className='text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-700'>
                        <span className='font-semibold'>{coupon.code}</span> - {coupon.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className='lg:col-span-1'>
                <OrderSummary
                  subtotal={subtotal}
                  discount={discount}
                  deliveryCost={getDeliveryCost()}
                  total={finalTotal}
                  onCheckout={() => document.getElementById("checkout-button").click()}
                />
              </div>
            </div>
          ) : (
            /* Empty Cart */
            <div className='text-center py-20'>
              <div className='text-8xl mb-6'>🛒</div>
              <h2 className='text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-4'>आपका बैग खाली है</h2>
              <p className='text-xl text-emerald-600 dark:text-emerald-400 mb-8'>भारतशाला में कुछ खूबसूरत चीजें खोजें</p>
              <a
                href="/markets"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span>🛍️</span>
                <span>खरीदारी शुरू करें</span>
              </a>
            </div>
          )}
        </div>

        {/* Hidden Checkout Button for Razorpay */}
        <button id="checkout-button" className="hidden"></button>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Bag;