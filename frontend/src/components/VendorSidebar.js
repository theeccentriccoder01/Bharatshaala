import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VendorSidebar = ({ vendor }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', name: 'डैशबोर्ड', icon: '📊', href: '/vendor/dashboard' },
        { id: 'orders', name: 'ऑर्डर सूची', icon: '📦', href: '/vendor/orders', badge: '8' },
        { id: 'items', name: 'उत्पाद प्रबंधन', icon: '🛍️', href: '/vendor/items' },
        { id: 'add-item', name: 'नया उत्पाद जोड़ें', icon: '➕', href: '/vendor/add-item' },
        { id: 'inventory', name: 'इन्वेंटरी', icon: '📋', href: '/vendor/inventory' },
        { id: 'analytics', name: 'एनालिटिक्स', icon: '📈', href: '/vendor/analytics' },
        { id: 'promotions', name: 'प्रमोशन', icon: '🎯', href: '/vendor/promotions' },
        { id: 'reviews', name: 'ग्राहक समीक्षा', icon: '⭐', href: '/vendor/reviews' },
        { id: 'settings', name: 'स्टोर सेटिंग्स', icon: '⚙️', href: '/vendor/settings' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('vendorToken');
        navigate('/login');
    };

    return (
        <div className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-200 dark:border-emerald-700 transition-all duration-300 ${
            isCollapsed ? 'w-20' : 'w-80'
        }`}>
            
            {/* Header */}
            <div className='p-6 border-b border-emerald-200 dark:border-emerald-700'>
                <div className='flex items-center justify-between'>
                    {!isCollapsed && (
                        <div className='flex items-center space-x-3'>
                            <div className='w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                                {vendor?.storeName?.charAt(0) || 'V'}
                            </div>
                            <div>
                                <h3 className='font-bold text-emerald-800 dark:text-emerald-200'>{vendor?.storeName || 'विक्रेता स्टोर'}</h3>
                                <p className='text-emerald-600 dark:text-emerald-400 text-sm'>{vendor?.category || 'सामान्य श्रेणी'}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className='p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200'
                    >
                        {isCollapsed ? '→' : '←'}
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className='p-4'>
                <ul className='space-y-2'>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={item.id}>
                                <a
                                    href={item.href}
                                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                                            : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className='text-xl'>{item.icon}</span>
                                    {!isCollapsed && (
                                        <>
                                            <span className='font-medium flex-1'>{item.name}</span>
                                            {item.badge && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    isActive 
                                                        ? 'bg-white/20 text-white' 
                                                        : 'bg-emerald-500 text-white'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Store Performance */}
            {!isCollapsed && (
                <div className='p-4 border-t border-emerald-200 dark:border-emerald-700'>
                    <div className='space-y-4'>
                        {/* Performance Stats */}
                        <div className='bg-gradient-to-br from-emerald-50 dark:from-gray-900 to-green-50 dark:to-gray-900 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700'>
                            <h4 className='font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-sm'>स्टोर प्रदर्शन</h4>
                            <div className='space-y-3'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-emerald-600 dark:text-emerald-400 text-sm'>इस महीने की बिक्री</span>
                                    <span className='font-bold text-emerald-800 dark:text-emerald-200'>₹45,230</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-emerald-600 dark:text-emerald-400 text-sm'>कुल ऑर्डर</span>
                                    <span className='font-bold text-emerald-800 dark:text-emerald-200'>127</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='text-emerald-600 dark:text-emerald-400 text-sm'>रेटिंग</span>
                                    <div className='flex items-center space-x-1'>
                                        <span className='text-yellow-500'>⭐</span>
                                        <span className='font-bold text-emerald-800 dark:text-emerald-200'>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className='space-y-2'>
                            <button className='w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105'>
                                नया उत्पाद जोड़ें
                            </button>
                            <button className='w-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl font-medium hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300'>
                                स्टोर देखें
                            </button>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className='w-full flex items-center justify-center space-x-2 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200'
                        >
                            <span>🚪</span>
                            <span className='font-medium'>लॉग आउट</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorSidebar;