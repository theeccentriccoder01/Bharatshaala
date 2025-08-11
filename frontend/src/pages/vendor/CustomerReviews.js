import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import VendorSidebar from '../components/VendorSidebar';
import ReviewCard from '../components/ReviewCard';

const CustomerReviews = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get, post, put } = useAPI();
  const { showSuccess, showError, showInfo } = useNotification();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [reply, setReply] = useState('');
  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    responseRate: 0,
    recentTrends: []
  });

  const ratingFilters = [
    { id: 'all', name: 'सभी रेटिंग्स', count: 0 },
    { id: '5', name: '5 स्टार', count: 0 },
    { id: '4', name: '4 स्टार', count: 0 },
    { id: '3', name: '3 स्टार', count: 0 },
    { id: '2', name: '2 स्टार', count: 0 },
    { id: '1', name: '1 स्टार', count: 0 }
  ];

  const statusFilters = [
    { id: 'all', name: 'सभी स्टेटस', count: 0 },
    { id: 'replied', name: 'उत्तर दिया गया', count: 0 },
    { id: 'pending', name: 'उत्तर बाकी', count: 0 },
    { id: 'flagged', name: 'फ्लैग किया गया', count: 0 }
  ];

  const sortOptions = [
    { id: 'recent', name: 'नवीनतम पहले' },
    { id: 'oldest', name: 'पुराने पहले' },
    { id: 'rating_high', name: 'उच्च रेटिंग' },
    { id: 'rating_low', name: 'कम रेटिंग' },
    { id: 'helpful', name: 'सबसे सहायक' },
    { id: 'needs_attention', name: 'ध्यान चाहिए' }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }
    loadReviews();
    loadAnalytics();
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterAndSortReviews();
  }, [reviews, filterRating, filterStatus, sortBy, searchTerm]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await get('/vendor/reviews');
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Mock data for demo
      const mockReviews = [
        {
          id: 1,
          productId: 1,
          productName: 'कुंदन पर्ल नेकलेस सेट',
          productImage: '/images/products/kundan-necklace-1.jpg',
          customerName: 'प्रिया शर्मा',
          customerAvatar: '/images/avatars/customer1.jpg',
          rating: 5,
          title: 'बहुत खूबसूरत डिज़ाइन',
          comment: 'यह नेकलेस सेट बहुत ही खूबसूरत है। क्वालिटी भी बहुत अच्छी है। शादी में पहनने के लिए एकदम परफेक्ट। पैकेजिंग भी बहुत अच्छी थी। डिलीवरी भी टाइम पर हुई।',
          images: ['/images/reviews/review1-1.jpg', '/images/reviews/review1-2.jpg'],
          createdAt: '2025-08-02T14:30:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 15,
          totalVotes: 18,
          orderDate: '2025-07-20T00:00:00Z',
          vendorReply: null,
          status: 'pending',
          sentiment: 'positive',
          tags: ['quality', 'design', 'packaging', 'delivery'],
          isPublic: true
        },
        {
          id: 2,
          productId: 2,
          productName: 'राजस्थानी चूड़ी सेट',
          productImage: '/images/products/bangle-set.jpg',
          customerName: 'अनिता देवी',
          customerAvatar: '/images/avatars/customer2.jpg',
          rating: 4,
          title: 'अच्छी क्वालिटी लेकिन कलर अलग',
          comment: 'चूड़ियों की क्वालिटी अच्छी है लेकिन कलर फोटो से थोड़ा अलग है। फिर भी संतुष्ट हूँ। साइज़ भी सही है।',
          images: [],
          createdAt: '2025-08-01T10:15:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 8,
          totalVotes: 12,
          orderDate: '2025-07-25T00:00:00Z',
          vendorReply: {
            message: 'धन्यवाद आपकी समीक्षा के लिए। हम कलर की जानकारी को और बेहतर बनाने पर काम कर रहे हैं।',
            createdAt: '2025-08-01T18:20:00Z'
          },
          status: 'replied',
          sentiment: 'neutral',
          tags: ['quality', 'color_issue'],
          isPublic: true
        },
        {
          id: 3,
          productId: 3,
          productName: 'हस्तनिर्मित पश्मीना शॉल',
          productImage: '/images/products/pashmina-shawl.jpg',
          customerName: 'सुनीता गुप्ता',
          customerAvatar: '/images/avatars/customer3.jpg',
          rating: 2,
          title: 'उम्मीद के अनुसार नहीं',
          comment: 'शॉल की क्वालिटी उम्मीद के अनुसार नहीं है। कीमत के हिसाब से बेहतर होना चाहिए था। मैटेरियल भी थोड़ा खुरदरा लगा।',
          images: [],
          createdAt: '2025-07-30T16:45:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 3,
          totalVotes: 8,
          orderDate: '2025-07-22T00:00:00Z',
          vendorReply: null,
          status: 'flagged',
          sentiment: 'negative',
          tags: ['quality_issue', 'material', 'price_concern'],
          isPublic: true
        },
        {
          id: 4,
          productId: 1,
          productName: 'कुंदन पर्ल नेकलेस सेट',
          productImage: '/images/products/kundan-necklace-1.jpg',
          customerName: 'मीरा यादव',
          customerAvatar: '/images/avatars/customer4.jpg',
          rating: 5,
          title: 'शानदार प्रोडक्ट',
          comment: 'बहुत ही बेहतरीन काम है। हर डिटेल परफेक्ट है। फैमिली की सभी महिलाओं को बहुत पसंद आया। कारीगरी की तारीफ करनी पड़ेगी।',
          images: ['/images/reviews/review4-1.jpg'],
          createdAt: '2025-07-28T12:00:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 22,
          totalVotes: 25,
          orderDate: '2025-07-18T00:00:00Z',
          vendorReply: {
            message: 'आपका बहुत-बहुत धन्यवाद! ऐसी प्रतिक्रिया हमारे लिए बहुत प्रेरणादायक है। आगे भी बेहतर उत्पाद देने की कोशिश करते रहेंगे।',
            createdAt: '2025-07-28T15:30:00Z'
          },
          status: 'replied',
          sentiment: 'positive',
          tags: ['excellent', 'craftsmanship', 'family_approved'],
          isPublic: true
        },
        {
          id: 5,
          productId: 4,
          productName: 'लकड़ी की हस्तशिल्प मूर्ति',
          productImage: '/images/products/wooden-sculpture.jpg',
          customerName: 'राजेश कुमार',
          customerAvatar: '/images/avatars/customer5.jpg',
          rating: 3,
          title: 'ठीक ठाक प्रोडक्ट',
          comment: 'प्रोडक्ट ठीक है लेकिन पैकेजिंग बेहतर हो सकती थी। एक कोना थोड़ा डैमेज था शिपिंग में।',
          images: [],
          createdAt: '2025-07-26T09:30:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 5,
          totalVotes: 9,
          orderDate: '2025-07-15T00:00:00Z',
          vendorReply: null,
          status: 'pending',
          sentiment: 'neutral',
          tags: ['packaging_issue', 'shipping_damage'],
          isPublic: true
        }
      ];
      setReviews(mockReviews);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    try {
      const response = await get('/vendor/reviews/analytics');
      if (response.success) {
        setAnalytics(response.analytics);
      }
    } catch (error) {
      // Mock analytics
      setAnalytics({
        totalReviews: 5,
        averageRating: 3.8,
        ratingDistribution: { 5: 2, 4: 1, 3: 1, 2: 1, 1: 0 },
        responseRate: 40,
        recentTrends: [
          { date: '2025-08-04', rating: 4.0, count: 0 },
          { date: '2025-08-03', rating: 4.2, count: 0 },
          { date: '2025-08-02', rating: 5.0, count: 1 },
          { date: '2025-08-01', rating: 4.0, count: 1 },
          { date: '2025-07-31', rating: 3.5, count: 0 },
          { date: '2025-07-30', rating: 2.0, count: 1 },
          { date: '2025-07-29', rating: 4.0, count: 0 }
        ]
      });
    }
  };

  const filterAndSortReviews = () => {
    let filtered = [...reviews];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulVotes - a.helpfulVotes;
        case 'needs_attention':
          return (a.rating <= 3 && !a.vendorReply ? -1 : 1) - (b.rating <= 3 && !b.vendorReply ? -1 : 1);
        default:
          return 0;
      }
    });

    // Update filter counts
    ratingFilters[0].count = reviews.length;
    for (let i = 1; i <= 5; i++) {
      ratingFilters[i].count = reviews.filter(r => r.rating === (6 - i)).length;
    }

    statusFilters[0].count = reviews.length;
    statusFilters[1].count = reviews.filter(r => r.vendorReply).length;
    statusFilters[2].count = reviews.filter(r => !r.vendorReply).length;
    statusFilters[3].count = reviews.filter(r => r.status === 'flagged').length;

    setFilteredReviews(filtered);
  };

  const handleReplyToReview = async () => {
    if (!reply.trim()) {
      showError('कृपया उत्तर लिखें');
      return;
    }

    try {
      const response = await post(`/vendor/reviews/${selectedReview.id}/reply`, {
        message: reply
      });

      if (response.success) {
        showSuccess('उत्तर सफलतापूर्वक भेजा गया!');
        setShowReplyModal(false);
        setSelectedReview(null);
        setReply('');
        loadReviews();
      }
    } catch (error) {
      showError('उत्तर भेजने में त्रुटि');
    }
  };

  const handleFlagReview = async (reviewId) => {
    try {
      const response = await put(`/vendor/reviews/${reviewId}/flag`);
      if (response.success) {
        showSuccess('समीक्षा फ्लैग की गई');
        loadReviews();
      }
    } catch (error) {
      showError('फ्लैग करने में त्रुटि');
    }
  };

  const openReplyModal = (review) => {
    setSelectedReview(review);
    setReply('');
    setShowReplyModal(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner message="समीक्षाएं लोड हो रही हैं..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            ⭐ ग्राहक समीक्षा प्रबंधन
          </h1>
          <p className="text-emerald-600 text-lg">
            अपने ग्राहकों की फीडबैक देखें और जवाब दें
          </p>
        </div>

        <div className="flex gap-8">
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <VendorSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">कुल समीक्षा</p>
                    <p className="text-3xl font-bold">{analytics.totalReviews}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm">औसत रेटिंग</p>
                    <p className="text-3xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">रिस्पॉन्स रेट</p>
                    <p className="text-3xl font-bold">{analytics.responseRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💭</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">उत्तर बाकी</p>
                    <p className="text-3xl font-bold">{reviews.filter(r => !r.vendorReply).length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">रेटिंग वितरण</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-24">
                      <span className="text-sm font-medium">{rating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${analytics.totalReviews > 0 ? (analytics.ratingDistribution[rating] / analytics.totalReviews) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {analytics.ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                
                {/* Search */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">खोजें</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ग्राहक, प्रोडक्ट या टिप्पणी खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">रेटिंग</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {ratingFilters.map(filter => (
                      <option key={filter.id} value={filter.id}>
                        {filter.name} ({filter.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">स्टेटस</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {statusFilters.map(filter => (
                      <option key={filter.id} value={filter.id}>
                        {filter.name} ({filter.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">क्रमबद्ध करें</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={review.customerAvatar || '/images/default-avatar.jpg'}
                          alt={review.customerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-emerald-800">{review.customerName}</h3>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                            {review.isVerifiedPurchase && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                ✓ सत्यापित खरीदारी
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl ${getSentimentColor(review.sentiment)}`}>
                          {getSentimentIcon(review.sentiment)}
                        </span>
                        {review.status === 'flagged' && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                            🚩 फ्लैग्ड
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-emerald-50 rounded-lg">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-emerald-800">{review.productName}</h4>
                        <p className="text-emerald-600 text-sm">
                          ऑर्डर दिनांक: {formatDate(review.orderDate)}
                        </p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      {review.title && (
                        <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
                      )}
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-3 mt-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() => window.open(image, '_blank')}
                            />
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {review.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Helpful Votes */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <span>👍 {review.helpfulVotes} लोगों को सहायक लगा</span>
                      <span>कुल वोट: {review.totalVotes}</span>
                    </div>

                    {/* Vendor Reply */}
                    {review.vendorReply ? (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-blue-800">विक्रेता का उत्तर:</span>
                          <span className="text-blue-600 text-sm">
                            {formatDate(review.vendorReply.createdAt)}
                          </span>
                        </div>
                        <p className="text-blue-700">{review.vendorReply.message}</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
                        <p className="text-yellow-800 font-medium">⏰ उत्तर देना बाकी है</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {!review.vendorReply && (
                          <button
                            onClick={() => openReplyModal(review)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                          >
                            💭 उत्तर दें
                          </button>
                        )}
                        
                        {review.status !== 'flagged' && (
                          <button
                            onClick={() => handleFlagReview(review.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                          >
                            🚩 फ्लैग करें
                          </button>
                        )}
                        
                        <button
                          onClick={() => navigate(`/products/${review.productId}`)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                        >
                          👁️ प्रोडक्ट देखें
                        </button>
                      </div>

                      {review.vendorReply && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ उत्तर दिया गया
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="text-8xl mb-6">⭐</div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                  कोई समीक्षा नहीं मिली
                </h2>
                <p className="text-emerald-600 mb-8">
                  {reviews.length === 0 
                    ? 'अभी तक कोई ग्राहक समीक्षा नहीं आई है।'
                    : 'आपके फ़िल्टर के अनुसार कोई समीक्षा नहीं मिली।'
                  }
                </p>
                {reviews.length === 0 && (
                  <button
                    onClick={() => navigate('/vendor/promotions')}
                    className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200"
                  >
                    बिक्री बढ़ाने के लिए प्रमोशन बनाएं
                  </button>
                )}
              </div>
            )}

            {/* Reply Modal */}
            {showReplyModal && selectedReview && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-800">समीक्षा का उत्तर दें</h2>
                    <button
                      onClick={() => setShowReplyModal(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Original Review */}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={selectedReview.customerAvatar || '/images/default-avatar.jpg'}
                        alt={selectedReview.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-emerald-800">{selectedReview.customerName}</h3>
                        {renderStars(selectedReview.rating)}
                      </div>
                    </div>
                    <h4 className="font-semibold mb-2">{selectedReview.title}</h4>
                    <p className="text-gray-700">{selectedReview.comment}</p>
                  </div>

                  {/* Reply Form */}
                  <div className="space-y-4">
                    <label className="block text-emerald-800 font-semibold mb-2">आपका उत्तर</label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
                      placeholder="ग्राहक को धन्यवाद दें और उनकी समस्या का समाधान बताएं..."
                    ></textarea>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 बेहतर उत्तर के लिए टिप्स:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• ग्राहक को धन्यवाद दें</li>
                        <li>• समस्या को समझें और समाधान बताएं</li>
                        <li>• भविष्य में बेहतर सेवा का आश्वासन दें</li>
                        <li>• व्यक्तिगत और विनम्र टोन रखें</li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowReplyModal(false)}
                      className="px-6 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50"
                    >
                      रद्द करें
                    </button>
                    <button
                      onClick={handleReplyToReview}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
                    >
                      उत्तर भेजें
                    </button>
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

export default CustomerReviews;