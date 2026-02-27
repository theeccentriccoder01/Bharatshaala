import React, { useState } from 'react';
import { dateHelpers, stringHelpers } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const ReviewCard = ({
  review,
  onUpdate,
  onDelete,
  onReport,
  onHelpful,
  isEditable = false,
  showActions = true,
  variant = 'default', // 'default', 'compact', 'detailed'
  className = ''
}) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [showFullReview, setShowFullReview] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    title: review.title || '',
    comment: review.comment,
    images: review.images || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const renderStars = (rating, size = 'medium', interactive = false) => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-lg',
      large: 'text-xl'
    };

    return (
      <div className={`flex items-center space-x-1 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={interactive ? () => setEditData({...editData, rating: star}) : undefined}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200 ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.comment.trim()) {
      showError('कृपया समीक्षा लिखें');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(review.id, editData);
      setShowEditForm(false);
      showSuccess('समीक्षा अपडेट हो गई!');
    } catch (error) {
      showError('समीक्षा अपडेट करने में त्रुटि');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      rating: review.rating,
      title: review.title || '',
      comment: review.comment,
      images: review.images || []
    });
    setShowEditForm(false);
  };

  const handleDelete = () => {
    if (window.confirm('क्या आप वाकई इस समीक्षा को हटाना चाहते हैं?')) {
      onDelete(review.id);
    }
  };

  const handleReport = () => {
    if (window.confirm('क्या आप इस समीक्षा को रिपोर्ट करना चाहते हैं?')) {
      onReport(review.id);
      showSuccess('समीक्षा रिपोर्ट की गई');
    }
  };

  const handleHelpfulVote = () => {
    if (!hasVoted) {
      onHelpful(review.id);
      setHasVoted(true);
      showSuccess('आपका वोट दर्ज हो गया!');
    }
  };

  const getSentimentColor = () => {
    if (review.rating >= 4) return 'text-green-600';
    if (review.rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentIcon = () => {
    if (review.rating >= 4) return '😊';
    if (review.rating >= 3) return '😐';
    return '😞';
  };

  const getTimeAgo = () => {
    return dateHelpers.getRelativeTime(review.createdAt);
  };

  const truncatedComment = stringHelpers.truncate(review.comment, 200);
  const shouldShowReadMore = review.comment.length > 200;

  const renderCompactVariant = () => (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-start space-x-3">
        <img
          src={review.customerAvatar || '/images/default-avatar.jpg'}
          alt={review.customerName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{review.customerName}</h4>
            {renderStars(review.rating, 'small')}
            <span className="text-gray-500 text-xs">{getTimeAgo()}</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{review.comment}</p>
          {review.isVerifiedPurchase && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-2">
              ✓ सत्यापित खरीदारी
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetailedVariant = () => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      {showEditForm ? (
        /* Edit Form */
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">समीक्षा संपादित करें</h3>
          
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">रेटिंग</label>
            {renderStars(editData.rating, 'large', true)}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">शीर्षक</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({...editData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="संक्षिप्त शीर्षक"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">समीक्षा</label>
            <textarea
              value={editData.comment}
              onChange={(e) => setEditData({...editData, comment: e.target.value})}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="अपना अनुभव विस्तार से बताएं..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors duration-200"
            >
              {isSubmitting ? 'सेव हो रहा है...' : 'सेव करें'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              रद्द करें
            </button>
          </div>
        </div>
      ) : (
        /* Display Mode */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={review.customerAvatar || '/images/default-avatar.jpg'}
                alt={review.customerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {renderStars(review.rating)}
                  <span className="text-gray-500 text-sm">{getTimeAgo()}</span>
                  <span className={`text-lg ${getSentimentColor()}`}>
                    {getSentimentIcon()}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-col space-y-2">
              {review.isVerifiedPurchase && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  ✓ सत्यापित खरीदारी
                </span>
              )}
              {review.isTopReviewer && (
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  👑 टॉप रिव्यूअर
                </span>
              )}
            </div>
          </div>

          {/* Product Info (if available) */}
          {review.productName && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {review.productImage && (
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h4 className="font-semibold text-gray-800">{review.productName}</h4>
                {review.orderDate && (
                  <p className="text-gray-600 text-sm">
                    खरीदारी दिनांक: {dateHelpers.formatDate(review.orderDate)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Review Content */}
          <div className="space-y-3">
            {review.title && (
              <h4 className="font-semibold text-gray-800 text-lg">{review.title}</h4>
            )}
            
            <div className="text-gray-700 leading-relaxed">
              {showFullReview || !shouldShowReadMore ? (
                <p>{review.comment}</p>
              ) : (
                <p>{truncatedComment}</p>
              )}
              
              {shouldShowReadMore && (
                <button
                  onClick={() => setShowFullReview(!showFullReview)}
                  className="text-emerald-600 hover:text-emerald-800 font-medium mt-2 text-sm"
                >
                  {showFullReview ? 'कम दिखाएं' : 'और पढ़ें'}
                </button>
              )}
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-3 mt-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url || image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => window.open(image.url || image, '_blank')}
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

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {/* Helpful Votes */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleHelpfulVote}
                disabled={hasVoted || (user && user.id === review.userId)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  hasVoted 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'hover:bg-gray-100 text-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>👍</span>
                <span>सहायक ({review.helpfulVotes || 0})</span>
              </button>
              
              {review.totalVotes > 0 && (
                <span className="text-gray-500 text-sm">
                  कुल वोट: {review.totalVotes}
                </span>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-2">
                {isEditable && user && user.id === review.userId && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      title="संपादित करें"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      title="हटाएं"
                    >
                      🗑️
                    </button>
                  </>
                )}
                
                {user && user.id !== review.userId && (
                  <button
                    onClick={handleReport}
                    className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                    title="रिपोर्ट करें"
                  >
                    🚩
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderDefaultVariant = () => (
    <div className={`bg-white rounded-xl p-6 shadow-md border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={review.customerAvatar || '/images/default-avatar.jpg'}
            alt={review.customerName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {renderStars(review.rating, 'small')}
              <span className="text-gray-500 text-sm">{getTimeAgo()}</span>
            </div>
          </div>
        </div>
        
        {review.isVerifiedPurchase && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            ✓ सत्यापित
          </span>
        )}
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
      )}
      
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {review.images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image.url || image}
              alt={`Review ${index + 1}`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ))}
          {review.images.length > 3 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              +{review.images.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={handleHelpfulVote}
          disabled={hasVoted}
          className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
        >
          <span>👍</span>
          <span>सहायक ({review.helpfulVotes || 0})</span>
        </button>
        
        {showActions && isEditable && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800"
            >
              संपादित करें
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              हटाएं
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'detailed':
      return renderDetailedVariant();
    default:
      return renderDefaultVariant();
  }
};

export default ReviewCard;