import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState(null);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inventory');

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
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
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

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center py-12">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-emerald-400"></div>
            </div>
            <span className="ml-3 text-emerald-600 font-medium">डेटा लोड हो रहा है...</span>
        </div>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <React.StrictMode>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-6">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-emerald-800 mb-2">व्यापार डैशबोर्ड</h1>
                        <p className="text-emerald-600 text-lg">अपने उत्पादों और बिक्री का विश्लेषण करें</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="कुल उत्पाद"
                            value={inventoryData ? JSON.parse(inventoryData).length : "0"}
                            color="from-emerald-500 to-green-600"
                            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/></svg>}
                        />
                        <StatCard
                            title="कुल बिक्री"
                            value={orderData ? orderData.reduce((sum, item) => sum + item.Quantity, 0) : "0"}
                            color="from-green-500 to-emerald-600"
                            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>}
                        />
                        <StatCard
                            title="कुल राजस्व"
                            value={`₹${orderData ? orderData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString() : "0"}`}
                            color="from-yellow-500 to-orange-500"
                            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/></svg>}
                        />
                        <StatCard
                            title="औसत मूल्य"
                            value={`₹${inventoryData ? Math.round(JSON.parse(inventoryData).reduce((sum, item) => sum + item.Price, 0) / JSON.parse(inventoryData).length) : "0"}`}
                            color="from-emerald-600 to-green-700"
                            icon={<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd"/></svg>}
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab('inventory')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'inventory'
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                        </svg>
                                        <span>वर्तमान इन्वेंटरी</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('sales')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                        activeTab === 'sales'
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                        <span>उत्पाद बिक्री</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {/* Inventory Table */}
                                    {activeTab === 'inventory' && (
                                        <div className="overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-emerald-600 to-green-600">
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                                                                उत्पाद नाम
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                विवरण
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                उपलब्ध मात्रा
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                                                                मूल्य
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {inventoryData !== null && JSON.parse(inventoryData).map((item, index) => (
                                                            <tr key={index} className={`hover:bg-emerald-50 transition-colors duration-200 ${
                                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                            }`}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                                                                            <span className="text-white font-semibold text-sm">
                                                                                {item.ItemName.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm font-medium text-gray-900">{item.ItemName}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-sm text-gray-900 max-w-xs truncate" title={item.ItemDesc}>
                                                                        {item.ItemDesc}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                                                        item.Quantity > 10 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : item.Quantity > 5 
                                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                                : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {item.Quantity} यूनिट
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                                                                    ₹{item.Price.toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sales Table */}
                                    {activeTab === 'sales' && (
                                        <div className="overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-emerald-600 to-green-600">
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                                                                उत्पाद नाम
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                मूल्य
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                                बेची गई मात्रा
                                                            </th>
                                                            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                                                                राजस्व
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {orderData !== null && orderData.map((item, index) => (
                                                            <tr key={index} className={`hover:bg-emerald-50 transition-colors duration-200 ${
                                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                            }`}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                                                                            <span className="text-white font-semibold text-sm">
                                                                                {item.ItemName.charAt(0)}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm font-medium text-gray-900">{item.ItemName}</div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    ₹{item.Price.toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                                            <div 
                                                                                className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full" 
                                                                                style={{ width: `${Math.min((item.Quantity / 50) * 100, 100)}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-sm text-gray-900">{item.Quantity}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                                                                    ₹{item.revenue.toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.StrictMode>
    );
};

export default InventoryTable;