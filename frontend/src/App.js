import React, { Suspense } from "react";
import "./App.css";
import "./styles/globals.css";
import "./styles/components.css";
import "./styles/responsive.css";
import "./styles/themes.css";
import "./styles/animations.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LanguageProvider } from "./context/LanguageContext";

// Core Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Main Pages
import Home from "./pages/Home";
import Markets from "./pages/Markets";
import Bag from "./pages/Bag";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import TrackOrder from "./pages/TrackOrder";
import Error from "./pages/Error";

// User Pages
import Settings from "./pages/user/Settings";
import UserOrders from "./pages/user/Orders";
import Dashboard from "./pages/user/Dashboard";
import AddressBook from "./pages/user/AddressBook";
import PaymentMethods from "./pages/user/PaymentMethods";
import Notifications from "./pages/user/Notifications";

// Vendor Pages
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorOrders from "./pages/vendor/Orders";
import Items from "./pages/vendor/Items";
import EditItem from "./pages/vendor/EditItem";
import AddItem from "./pages/vendor/AddItem";
import Analytics from "./pages/vendor/Analytics";
import Inventory from "./pages/vendor/Inventory";

// Menu Pages
import About from "./pages/menu/About";
import Contact from "./pages/menu/Contact";
import FAQ from "./pages/menu/FAQ";
import PrivacyPolicy from "./pages/menu/PrivacyPolicy";
import TermsOfService from "./pages/menu/TermsOfService";
import ShippingInfo from "./pages/menu/ShippingInfo";
import ReturnPolicy from "./pages/menu/ReturnPolicy";
import Support from "./pages/menu/Support";

// Category Pages
import Clothing from "./pages/categories/Clothing";
import Jewellery from "./pages/categories/Jewellery";
import Handicrafts from "./pages/categories/Handicrafts";
import Books from "./pages/categories/Books";
import Accessories from "./pages/categories/Accessories";
import Houseware from "./pages/categories/Houseware";
import CategoryLanding from "./pages/categories/CategoryLanding";
import CategoriesOverview from "./pages/categories/CategoriesOverview";

// Market Pages - All Major Markets
import PinkCity from "./pages/markets/pinkcity/PinkCity";
import Shop1 from "./pages/markets/pinkcity/Shop1";
import ChandniChowk from "./pages/markets/chandni_chowk/ChandniChowk";
import ColabaCauseway from "./pages/markets/colaba_causeway/ColabaCauseway";
import CommercialStreet from "./pages/markets/commercial_street/CommercialStreet";
import DilliHaat from "./pages/markets/dilli_haat/DilliHaat";
import LaadBazaar from "./pages/markets/laad_bazaar/LaadBazaar";
import DevarajaMarket from "./pages/markets/devaraja_market/DevarajaMarket";

// Admin Pages (if needed)
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import UserManagement from "./pages/admin/UserManagement";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              कुछ गलत हो गया है
            </h1>
            <p className="text-gray-600 mb-4">
              पेज लोड करने में समस्या हो रही है। कृपया पेज को रिफ्रेश करें।
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              पेज रिफ्रेश करें
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route Component for Vendor/Admin areas
const ProtectedRoute = ({ children, requiredRole }) => {
  // Add authentication logic here
  // For now, returning children directly
  return children;
};

function App() {
  return (
    <ErrorBoundary>
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <NotificationProvider>
              <LanguageProvider>
                <React.StrictMode>
                  <Router>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      
                      <main className="flex-grow">
                        <Suspense fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <LoadingSpinner />
                          </div>
                        }>
                          <Routes>
                            {/* Main Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/markets" element={<Markets />} />
                            <Route path="/bag" element={<Bag />} />
                            <Route path="/cart" element={<Navigate to="/bag" replace />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/item/:id" element={<Navigate to="/product/:id" replace />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/order-confirmation" element={<OrderConfirmation />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/track-order" element={<TrackOrder />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/register" element={<Navigate to="/signup" replace />} />
                            <Route path="/account" element={<Account />} />

                            {/* Menu Pages */}
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<TermsOfService />} />
                            <Route path="/shipping" element={<ShippingInfo />} />
                            <Route path="/returns" element={<ReturnPolicy />} />
                            <Route path="/support" element={<Support />} />

                            {/* User Routes */}
                            <Route path="/user/dashboard" element={<Dashboard />} />
                            <Route path="/user/settings" element={<Settings />} />
                            <Route path="/user/orders" element={<UserOrders />} />
                            <Route path="/user/addresses" element={<AddressBook />} />
                            <Route path="/user/payments" element={<PaymentMethods />} />
                            <Route path="/user/notifications" element={<Notifications />} />

                            {/* Category Routes */}
                            <Route path="/categories" element={<CategoriesOverview />} />
                            <Route path="/categories/:categorySlug" element={<CategoryLanding />} />
                            <Route path="/categories/clothing" element={<Clothing />} />
                            <Route path="/categories/jewellery" element={<Jewellery />} />
                            <Route path="/categories/jewelry" element={<Navigate to="/categories/jewellery" replace />} />
                            <Route path="/categories/handicrafts" element={<Handicrafts />} />
                            <Route path="/categories/books" element={<Books />} />
                            <Route path="/categories/accessories" element={<Accessories />} />
                            <Route path="/categories/houseware" element={<Houseware />} />

                            {/* Market Routes - All Major Markets */}
                            <Route path="/markets/pinkcity" element={<PinkCity />} />
                            <Route path="/markets/pinkcity_bazaar" element={<Navigate to="/markets/pinkcity" replace />} />
                            <Route path="/markets/pinkcity/shop1" element={<Shop1 />} />
                            <Route path="/markets/pinkcity_bazaar/shop1" element={<Navigate to="/markets/pinkcity/shop1" replace />} />
                            
                            <Route path="/markets/chandni-chowk" element={<ChandniChowk />} />
                            <Route path="/markets/chandni_chowk" element={<Navigate to="/markets/chandni-chowk" replace />} />
                            
                            <Route path="/markets/colaba-causeway" element={<ColabaCauseway />} />
                            <Route path="/markets/colaba_causeway" element={<Navigate to="/markets/colaba-causeway" replace />} />
                            
                            <Route path="/markets/commercial-street" element={<CommercialStreet />} />
                            <Route path="/markets/commercial_street" element={<Navigate to="/markets/commercial-street" replace />} />
                            
                            <Route path="/markets/dilli-haat" element={<DilliHaat />} />
                            <Route path="/markets/dilli_haat" element={<Navigate to="/markets/dilli-haat" replace />} />
                            
                            <Route path="/markets/laad-bazaar" element={<LaadBazaar />} />
                            <Route path="/markets/laad_bazaar" element={<Navigate to="/markets/laad-bazaar" replace />} />
                            
                            <Route path="/markets/devaraja-market" element={<DevarajaMarket />} />
                            <Route path="/markets/devaraja_market" element={<Navigate to="/markets/devaraja-market" replace />} />

                            {/* Vendor Routes - Protected */}
                            <Route path="/vendor/dashboard" element={
                              <ProtectedRoute requiredRole="vendor">
                                <VendorDashboard />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/orders" element={
                              <ProtectedRoute requiredRole="vendor">
                                <VendorOrders />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/items" element={
                              <ProtectedRoute requiredRole="vendor">
                                <Items />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/items/edit/:id?" element={
                              <ProtectedRoute requiredRole="vendor">
                                <EditItem />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/items/edit" element={
                              <ProtectedRoute requiredRole="vendor">
                                <EditItem />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/items/add" element={
                              <ProtectedRoute requiredRole="vendor">
                                <AddItem />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/analytics" element={
                              <ProtectedRoute requiredRole="vendor">
                                <Analytics />
                              </ProtectedRoute>
                            } />
                            <Route path="/vendor/inventory" element={
                              <ProtectedRoute requiredRole="vendor">
                                <Inventory />
                              </ProtectedRoute>
                            } />

                            {/* Admin Routes - Uncomment if needed */}
                            {/*
                            <Route path="/admin/dashboard" element={
                              <ProtectedRoute requiredRole="admin">
                                <AdminDashboard />
                              </ProtectedRoute>
                            } />
                            <Route path="/admin/users" element={
                              <ProtectedRoute requiredRole="admin">
                                <UserManagement />
                              </ProtectedRoute>
                            } />
                            */}

                            {/* Catch-all Error Route */}
                            <Route path="*" element={<Error />} />
                          </Routes>
                        </Suspense>
                      </main>
                      
                      <Footer />
                    </div>
                  </Router>
                </React.StrictMode>
              </LanguageProvider>
            </NotificationProvider>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;