import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import { useRecentlyViewed } from '../hooks/useLocalStorage';
import QuantitySelector from '../components/QuantitySelector';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isItemInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const { get } = useAPI();
  const { showSuccess, showError } = useNotification();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await get(`/products/${id}`);
      if (response.success) {
        setProduct(response.product);
        setSelectedVariant(response.product.variants?.[0] || null);
        addToRecentlyViewed(response.product);
        loadReviews();
        loadSimilarProducts();
      }
    } catch (error) {
      console.error('Error loading product:', error);
      // Mock data for demo
      const mockProduct = {
        id: parseInt(id),
        name: 'कुंदन पर्ल नेकलेस सेट',
        nameEn: 'Kundan Pearl Necklace Set',
        description: 'पारंपरिक राजस्थानी कुंदन कारीगरी के साथ मोतियों का यह खूबसूरत हार सेट। शादी-विवाह और त्योहारों के लिए एकदम परफेक्ट। हर मोती को हाथ से चुना गया है और कुंदन की सेटिंग पीढ़ियों पुराने कारीगरों द्वारा की गई है।',
        price: 15999,
        originalPrice: 19999,
        discount: 20,
        images: [
          { url: '/images/items/kundan-necklace-1.jpg', alt: 'मुख्य छवि' },
          { url: '/images/items/kundan-necklace-2.jpg', alt: 'साइड व्यू' },
          { url: '/images/items/kundan-necklace.jpg', alt: 'डिटेल व्यू' }
        ],
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        quantity: 5,
        vendor: {
          id: 'rajasthani-gems',
          name: 'राजस्थानी जेम्स',
          rating: 4.8,
          location: 'जयपुर, राजस्थान',
          responseTime: '2 घंटे के अंदर'
        },
        category: {
          id: 'jewelry',
          name: 'आभूषण'
        },
        specifications: {
          material: 'स्टर्लिंग सिल्वर, कुंदन, पर्ल',
          weight: '45 ग्राम',
          dimensions: '18 इंच (समायोज्य)',
          care: 'सूखे कपड़े से साफ करें, नमी से बचें',
          warranty: '6 महीने की वारंटी'
        },
        variants: [
          { id: 1, name: 'गोल्ड प्लेटेड', price: 15999, inStock: true },
          { id: 2, name: 'सिल्वर प्लेटेड', price: 12999, inStock: true },
          { id: 3, name: 'रोज गोल्ड', price: 17999, inStock: false }
        ],
        tags: ['कुंदन', 'पर्ल', 'नेकलेस', 'राजस्थानी', 'हैंडमेड', 'वेडिंग'],
        features: [
          '100% हस्तनिर्मित',
          'प्रीमियम पैकेजिंग',
          'फ्री होम डिलीवरी',
          'आसान रिटर्न पॉलिसी',
          'बीआईएस हॉलमार्क'
        ]
      };
      setProduct(mockProduct);
      setSelectedVariant(mockProduct.variants[0]);
      addToRecentlyViewed(mockProduct);
      
      // Mock reviews
      setReviews([
        {
          id: 1,
          userName: 'प्रिया शर्मा',
          rating: 5,
          comment: 'बहुत ही खूबसूरत डिज़ाइन है। क्वालिटी भी बहुत अच्छी है। शादी में पहनने के लिए एकदम परफेक्ट।',
          createdAt: '2024-01-20',
          isVerifiedPurchase: true,
          helpfulVotes: 12
        },
        {
          id: 2,
          userName: 'अनिता देवी',
          rating: 4,
          comment: 'अच्छा प्रोडक्ट है लेकिन थोड़ा भारी है। फोटो में जितना अच्छा दिख रहा था, वैसा ही मिला।',
          createdAt: '2024-01-15',
          isVerifiedPurchase: true,
          helpfulVotes: 8
        }
      ]);
    }
    setLoading(false);
  };

  const loadReviews = async () => {
    // Implementation for loading reviews
  };

  const loadSimilarProducts = async () => {
    // Implementation for loading similar products
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const productToAdd = {
      ...product,
      selectedVariant,
      price: selectedVariant?.price || product.price
    };

    const result = await addToCart(productToAdd, quantity);
    if (result.success) {
      showSuccess('कार्ट में जोड़ दिया गया!');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const checkDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      showError('कृपया सही पिनकोड डालें');
      return;
    }

    // Mock delivery check
    setDeliveryInfo({
      available: true,
      estimatedDays: '3-5',
      codAvailable: true,
      freeDelivery: true
    });
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const tabs = [
    { id: 'description', name: 'विवरण', icon: '📝' },
    { id: 'specifications', name: 'स्पेसिफिकेशन', icon: '📋' },
    { id: 'reviews', name: `समीक्षा (${product?.reviewCount || 0})`, icon: '⭐' },
    { id: 'delivery', name: 'डिलीवरी जानकारी', icon: '🚚' }
  ];

  if (loading) {
    return <LoadingSpinner message="उत्पाद लोड हो रहा है..." />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">उत्पाद नहीं मिला</h2>
          <button
            onClick={() => navigate('/markets')}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
          >
            बाज़ार देखें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-emerald-600">
            <button onClick={() => navigate('/')} className="hover:text-emerald-700">होम</button>
            <span>›</span>
            <button onClick={() => navigate('/markets')} className="hover:text-emerald-700">बाज़ार</button>
            <span>›</span>
            <button onClick={() => navigate(`/categories/${product.category.id}`)} className="hover:text-emerald-700">
              {product.category.name}
            </button>
            <span>›</span>
            <span className="text-gray-500">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.images[selectedImage]?.alt}
                className="w-full h-96 object-cover rounded-xl"
              />
              
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% छूट
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`bg-white rounded-lg p-2 border-2 transition-all duration-200 ${
                    selectedImage === index ? 'border-emerald-500' : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-20 object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.nameEn}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-emerald-600 font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} समीक्षा)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-emerald-800">
                  ₹{selectedVariant?.price?.toLocaleString() || product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {product.discount}% बचत
                  </span>
                )}
              </div>
              <p className="text-emerald-600 text-sm mt-2">सभी टैक्स शामिल</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-emerald-800 mb-3">वेरिएंट चुनें:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.inStock}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedVariant?.id === variant.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : variant.inStock
                            ? 'border-gray-200 hover:border-emerald-300'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {variant.name}
                      <div className="text-xs mt-1">₹{variant.price.toLocaleString()}</div>
                      {!variant.inStock && <div className="text-xs text-red-500">स्टॉक में नहीं</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <QuantitySelector
                value={quantity}
                min={1}
                max={product.quantity || 10}
                onChange={setQuantity}
                label="मात्रा"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isItemInCart(product.id) ? 
                  `कार्ट में जोड़ें (${getItemQuantity(product.id)} पहले से)` : 
                  'कार्ट में जोड़ें'
                }
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                अभी खरीदें
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 
                  (product.quantity > 10 ? 'स्टॉक में उपलब्ध' : `केवल ${product.quantity} बचे`) : 
                  'स्टॉक में नहीं'
                }
              </span>
            </div>

            {/* Vendor Info */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2">विक्रेता की जानकारी</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.vendor.name}</p>
                  <p className="text-sm text-gray-600">{product.vendor.location}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm">{product.vendor.rating}</span>
                    <span className="text-sm text-gray-500">रेटिंग</span>
                  </div>
                </div>
                <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors duration-200">
                  स्टोर देखें
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pincode Check */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="font-bold text-emerald-800 mb-4">डिलीवरी चेक करें</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="पिनकोड डालें"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              maxLength={6}
              className="flex-1 px-4 py-3 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={checkDelivery}
              className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
            >
              चेक करें
            </button>
          </div>
          
          {deliveryInfo && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600">✅</span>
                <span className="font-semibold text-green-800">डिलीवरी उपलब्ध</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>• अनुमानित डिलीवरी: {deliveryInfo.estimatedDays} कार्यदिवस</p>
                <p>• {deliveryInfo.freeDelivery ? 'मुफ्त डिलीवरी' : 'डिलीवरी चार्ज लागू'}</p>
                <p>• {deliveryInfo.codAvailable ? 'कैश ऑन डिलीवरी उपलब्ध' : 'केवल ऑनलाइन भुगतान'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">उत्पाद विवरण</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                
                {product.features && (
                  <div>
                    <h4 className="font-semibold text-emerald-800 mb-3">मुख्य विशेषताएं:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="text-emerald-500">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-bold text-emerald-800 mb-4">तकनीकी विवरण</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-2">
                      <dt className="font-semibold text-emerald-800 capitalize">{key}:</dt>
                      <dd className="text-gray-700">{value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-emerald-800">ग्राहक समीक्षा</h3>
                  <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
                    समीक्षा लिखें
                  </button>
                </div>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Tab */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">डिलीवरी जानकारी</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-600 text-xl">🚚</span>
                      <div>
                        <h4 className="font-semibold">मुफ्त डिलीवरी</h4>
                        <p className="text-gray-600 text-sm">₹499 से अधिक के ऑर्डर पर</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-600 text-xl">📦</span>
                      <div>
                        <h4 className="font-semibold">सुरक्षित पैकेजिंग</h4>
                        <p className="text-gray-600 text-sm">प्रीमियम पैकेजिंग के साथ</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-600 text-xl">🔄</span>
                      <div>
                        <h4 className="font-semibold">आसान रिटर्न</h4>
                        <p className="text-gray-600 text-sm">7 दिन की रिटर्न गारंटी</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-600 text-xl">💳</span>
                      <div>
                        <h4 className="font-semibold">कैश ऑन डिलीवरी</h4>
                        <p className="text-gray-600 text-sm">उपलब्ध (चुनिंदा शहरों में)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;