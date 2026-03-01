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


//MAIN PAGES
const Home = React.lazy(() => import("./pages/Home"));
const Markets = React.lazy(() => import("./pages/Markets"));
const Bag = React.lazy(() => import("./pages/Bag"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Account = React.lazy(() => import("./pages/Account"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderConfirmation = React.lazy(() => import("./pages/OrderConfirmation"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const TrackOrder = React.lazy(() => import("./pages/TrackOrder"));
const Error = React.lazy(() => import("./pages/Error"));



//USER PAGES
const Settings = React.lazy(() => import("./pages/user/Settings"));
const UserOrders = React.lazy(() => import("./pages/user/Orders"));
const Dashboard = React.lazy(() => import("./pages/user/Dashboard"));
const AddressBook = React.lazy(() => import("./pages/user/AddressBook"));
const PaymentMethods = React.lazy(() => import("./pages/user/PaymentMethods"));
const Notifications = React.lazy(() => import("./pages/user/Notifications"));



//VENDOR PAGES
const VendorDashboard = React.lazy(() => import("./pages/vendor/Dashboard"));
const VendorOrders = React.lazy(() => import("./pages/vendor/Orders"));
const Items = React.lazy(() => import("./pages/vendor/Items"));
const EditItem = React.lazy(() => import("./pages/vendor/EditItem"));
const AddItem = React.lazy(() => import("./pages/vendor/AddItem"));
const Analytics = React.lazy(() => import("./pages/vendor/Analytics"));
const Inventory = React.lazy(() => import("./pages/vendor/Inventory"));



//MENU PAGES
const About = React.lazy(() => import("./pages/menu/About"));
const Contact = React.lazy(() => import("./pages/menu/Contact"));
const FAQ = React.lazy(() => import("./pages/menu/FAQ"));
const PrivacyPolicy = React.lazy(() => import("./pages/menu/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/menu/TermsOfService"));
const ShippingInfo = React.lazy(() => import("./pages/menu/ShippingInfo"));
const ReturnPolicy = React.lazy(() => import("./pages/menu/ReturnPolicy"));
const Support = React.lazy(() => import("./pages/menu/Support"));



//CATEGORY PAGES
const Clothing = React.lazy(() => import("./pages/categories/Clothing"));
const Jewellery = React.lazy(() => import("./pages/categories/Jewellery"));
const Handicrafts = React.lazy(() => import("./pages/categories/Handicrafts"));
const Books = React.lazy(() => import("./pages/categories/Books"));
const Accessories = React.lazy(() => import("./pages/categories/Accessories"));
const Houseware = React.lazy(() => import("./pages/categories/Houseware"));
const CategoryLanding = React.lazy(() => import("./pages/categories/CategoryLanding"));
const CategoriesOverview = React.lazy(() => import("./pages/categories/CategoriesOverview"));



//MARKET PAGES 
const PinkCity = React.lazy(() => import("./pages/markets/pinkcity/PinkCity"));
const Shop1 = React.lazy(() => import("./pages/markets/pinkcity/Shop1"));
const ChandniChowk = React.lazy(() => import("./pages/markets/chandni_chowk/ChandniChowk"));
const ColabaCauseway = React.lazy(() => import("./pages/markets/colaba_causeway/ColabaCauseway"));
const CommercialStreet = React.lazy(() => import("./pages/markets/commercial_street/CommercialStreet"));
const DilliHaat = React.lazy(() => import("./pages/markets/dilli_haat/DilliHaat"));
const LaadBazaar = React.lazy(() => import("./pages/markets/laad_bazaar/LaadBazaar"));
const DevarajaMarket = React.lazy(() => import("./pages/markets/devaraja_market/DevarajaMarket"));

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              कुछ गलत हो गया है
            </h1>
            <p className="mb-4 text-gray-600">
              पेज लोड करने में समस्या हो रही है। कृपया पेज को रिफ्रेश करें।
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-white rounded-lg bg-emerald-600 hover:bg-emerald-700"
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
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      
                      <main className="flex-grow">
                        <Suspense fallback={
                          <div className="flex items-center justify-center min-h-screen">
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