import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import ReviewCard from '../components/ReviewCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Reviews = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { get, post, put, delete: deleteReview } = useAPI();
  const { showSuccess, showError } = useNotification();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('filter') || 'all');
  const [sortBy, setSortBy] = useState('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);

  const filterOptions = [
    { id: 'all', name: 'सभी समीक्षा', icon: '💬' },
    { id: 'my_reviews', name: 'मेरी समीक्षा', icon: '👤' },
    { id: 'pending', name: 'लिखने बाकी', icon: '⏳' },
    { id: 'helpful', name: 'सहायक', icon: '👍' },
    { id: 'recent', name: 'हाल की', icon: '🕒' }
  ];

  const sortOptions = [
    { id: 'recent', name: 'नवीनतम पहले' },
    { id: 'oldest', name: 'पुराने पहले' },
    { id: 'rating-high', name: 'उच्च रेटिंग' },
    { id: 'rating-low', name: 'कम रेटिंग' },
    { id: 'helpful', name: 'सबसे सहायक' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/reviews');
      return;
    }
    loadReviews();
  }, [isAuthenticated, filter, sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await get('/reviews', {
        params: { filter, sortBy, userId: user.id }
      });
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Mock data for demo
      setReviews([
        {
          id: 1,
          productId: 123,
          productName: 'कुंदन पर्ल नेकलेस सेट',
          productImage: '/images/products/kundan-necklace-1.jpg',
          userName: user.name || 'आप',
          userId: user.id,
          rating: 5,
          title: 'बहुत अच्छा प्रोडक्ट',
          comment: 'यह नेकलेस सेट बहुत ही खूबसूरत है। क्वालिटी भी बहुत अच्छी है। शादी में पहनने के लिए एकदम परफेक्ट है।',
          images: [],
          createdAt: '2024-01-20T10:30:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 15,
          totalVotes: 18,
          canEdit: true,
          orderDate: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          productId: 124,
          productName: 'राजस्थानी चूड़ी सेट',
          productImage: '/images/products/bangle-set.jpg',
          userName: 'प्रिया शर्मा',
          userId: 456,
          rating: 4,
          title: 'अच्छी क्वालिटी',
          comment: 'चूड़ियों की क्वालिटी अच्छी है लेकिन कलर फोटो से थोड़ा अलग है।',
          images: [
            { url: '/images/reviews/review-1.jpg', alt: 'Review image' }
          ],
          createdAt: '2024-01-18T15:45:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 8,
          totalVotes: 12,
          canEdit: false
        },
        {
          id: 3,
          productId: 125,
          productName: 'हस्तनिर्मित शॉल',
          productImage: '/images/products/handmade-shawl.jpg',
          userName: 'अनिता देवी',
          userId: 789,
          rating: 3,
          title: 'ठीक ठाक',
          comment: 'शॉल की गुणवत्ता ठीक है लेकिन कीमत के अनुपात में थोड़ा महंगा लगा।',
          images: [],
          createdAt: '2024-01-16T12:20:00Z',
          isVerifiedPurchase: true,
          helpfulVotes: 3,
          totalVotes: 8,
          canEdit: false
        }
      ]);
      
      // Add pending reviews for demo
      if (filter === 'pending') {
        setReviews([
          {
            id: 'pending-1',
            productId: 126,
            productName: 'मैसूर सिल्क साड़ी',
            productImage: '/images/products/mysore-silk.jpg',
            orderDate: '2024-01-25T00:00:00Z',
            isPending: true,
            canWrite: true
          }
        ]);
      }
    }
    setLoading(false);
  };

  const handleWriteReview = (product) => {
    setSelectedProduct(product);
    setShowWriteReview(true);
    setNewReview({
      rating: 5,
      title: '',
      comment: '',
      images: []
    });
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      showError('कृपया समीक्षा लिखें');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        productId: selectedProduct.productId,
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        images: newReview.images
      };

      const response = await post('/reviews', reviewData);
      if (response.success) {
        showSuccess('समीक्षा सफलतापूर्वक जोड़ी गई!');
        setShowWriteReview(false);
        loadReviews();
      }
    } catch (error) {
      showError('समीक्षा जोड़ने में त्रुटि');
    }
    setSubmitting(false);
  };

  const handleUpdateReview = async (reviewId, updates) => {
    try {
      const response = await put(`/reviews/${reviewId}`, updates);
      if (response.success) {
        showSuccess('समीक्षा अपडेट हो गई!');
        loadReviews();
      }
    } catch (error) {
      showError('समीक्षा अपडेट करने में त्रुटि');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('क्या आप वाकई इस समीक्षा को हटाना चाहते हैं?')) {
      return;
    }

    try {
      const response = await deleteReview(`/reviews/${reviewId}`);
      if (response.success) {
        showSuccess('समीक्षा हटा दी गई!');
        loadReviews();
      }
    } catch (error) {
      showError('समीक्षा हटाने में त्रुटि');
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    try {
      const response = await post(`/reviews/${reviewId}/helpful`);
      if (response.success) {
        loadReviews();
      }
    } catch (error) {
      showError('वोट करने में त्रुटि');
    }
  };

  const renderStars = (rating, isInteractive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={isInteractive ? () => onRatingChange?.(star) : undefined}
            className={`text-2xl ${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            disabled={!isInteractive}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="समीक्षाएं लोड हो रही हैं..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            ग्राहक समीक्षा
          </h1>
          <p className="text-emerald-600 text-lg">
            अपनी खरीदारी का अनुभव साझा करें और अन्य ग्राहकों की मदद करें
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Filter Options */}
            <div>
              <label className="block text-emerald-800 font-semibold mb-3">फ़िल्टर करें</label>
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilter(option.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === option.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-emerald-800 font-semibold mb-3">क्रमबद्ध करें</label>
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

            {/* Review Stats */}
            <div className="bg-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">आपकी समीक्षा</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>कुल समीक्षा:</span>
                  <span className="font-semibold">
                    {reviews.filter(r => r.userId === user.id && !r.isPending).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>लिखने बाकी:</span>
                  <span className="font-semibold">
                    {reviews.filter(r => r.isPending).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>औसत रेटिंग:</span>
                  <span className="font-semibold">
                    {reviews.filter(r => r.userId === user.id && !r.isPending).length > 0
                      ? (reviews
                          .filter(r => r.userId === user.id && !r.isPending)
                          .reduce((acc, r) => acc + r.rating, 0) / 
                         reviews.filter(r => r.userId === user.id && !r.isPending).length
                        ).toFixed(1)
                      : '0.0'
                    } ⭐
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              review.isPending ? (
                /* Pending Review Card */
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={review.productImage} 
                        alt={review.productName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-emerald-800">{review.productName}</h3>
                        <p className="text-gray-600">
                          खरीदारी की दिनांक: {new Date(review.orderDate).toLocaleDateString('hi-IN')}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                            ⏳ समीक्षा लिखना बाकी
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleWriteReview(review)}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      समीक्षा लिखें
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Review Card */
                <ReviewCard
                  key={review.id}
                  review={review}
                  onUpdate={handleUpdateReview}
                  onDelete={handleDeleteReview}
                  onReport={() => {}} // Implement report functionality
                  isEditable={review.userId === user.id}
                  showActions={true}
                />
              )
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                {filter === 'pending' ? 'कोई समीक्षा लिखना बाकी नहीं' : 'कोई समीक्षा नहीं मिली'}
              </h3>
              <p className="text-emerald-600 mb-6">
                {filter === 'pending' 
                  ? 'सभी खरीदे गए उत्पादों की समीक्षा लिख दी गई है।'
                  : 'पहली समीक्षा लिखने वाले बनें!'
                }
              </p>
              <button
                onClick={() => navigate('/markets')}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
              >
                खरीदारी करें
              </button>
            </div>
          )}
        </div>

        {/* Write Review Modal */}
        {showWriteReview && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">समीक्षा लिखें</h2>
                <button
                  onClick={() => setShowWriteReview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={submitting}
                >
                  ×
                </button>
              </div>

              {/* Product Info */}
              <div className="flex items-center space-x-4 mb-6 p-4 bg-emerald-50 rounded-xl">
                <img 
                  src={selectedProduct.productImage} 
                  alt={selectedProduct.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-emerald-800">{selectedProduct.productName}</h3>
                  <p className="text-gray-600">
                    खरीदारी की दिनांक: {new Date(selectedProduct.orderDate).toLocaleDateString('hi-IN')}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-emerald-800 font-semibold mb-3">रेटिंग दें *</label>
                {renderStars(newReview.rating, true, (rating) => setNewReview({...newReview, rating}))}
                <p className="text-gray-600 text-sm mt-2">
                  {newReview.rating === 5 ? 'उत्कृष्ट' :
                   newReview.rating === 4 ? 'अच्छा' :
                   newReview.rating === 3 ? 'ठीक' :
                   newReview.rating === 2 ? 'खराब' : 'बहुत खराब'}
                </p>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-emerald-800 font-semibold mb-2">शीर्षक</label>
                <input
                  type="text"
                  placeholder="संक्षिप्त शीर्षक लिखें"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-emerald-800 font-semibold mb-2">समीक्षा *</label>
                <textarea
                  placeholder="अपना अनुभव विस्तार से बताएं..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
                ></textarea>
                <p className="text-gray-500 text-sm mt-2">
                  कम से कम 10 शब्द लिखें। अन्य ग्राहकों की मदद के लिए विस्तार से बताएं।
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowWriteReview(false)}
                  disabled={submitting}
                  className="px-6 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors duration-200 disabled:opacity-50"
                >
                  रद्द करें
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || !newReview.comment.trim()}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {submitting ? 'सबमिट हो रहा है...' : 'समीक्षा सबमिट करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;