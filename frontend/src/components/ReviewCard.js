import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const ReviewCard = ({ 
  review, 
  onUpdate, 
  onDelete, 
  onReport, 
  isEditable = false,
  showActions = true,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const { user } = useAuth();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editRating > 0) {
      onUpdate?.(review.id, {
        comment: editText.trim(),
        rating: editRating
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(review.comment);
    setEditRating(review.rating);
    setIsEditing(false);
  };

  const renderStars = (rating, isInteractive = false, size = 'text-base') => {
    return (
      <div className={`flex items-center space-x-1 ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={isInteractive ? () => setEditRating(star) : undefined}
            className={`${isInteractive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-200 ${
              star <= (isInteractive ? editRating : rating) 
                ? 'text-yellow-500' 
                : 'text-gray-300'
            }`}
            disabled={!isInteractive}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    const ratingTexts = {
      5: 'बहुत अच्छा',
      4: 'अच्छा',
      3: 'ठीक है',
      2: 'खराब',
      1: 'बहुत खराब'
    };
    return ratingTexts[rating] || '';
  };

  const isOwner = user && user.id === review.userId;
  const canEdit = isEditable && isOwner;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-emerald-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-emerald-100">
        <div className="flex items-start justify-between">
          
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {review.userName?.charAt(0) || review.userInitial || 'U'}
            </div>
            <div>
              <h4 className="font-semibold text-emerald-800">{review.userName || 'ग्राहक'}</h4>
              <div className="flex items-center space-x-2 mt-1">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    {renderStars(editRating, true, 'text-lg')}
                    <span className="text-emerald-600 text-sm font-medium">
                      ({editRating}/5) {getRatingText(editRating)}
                    </span>
                  </div>
                ) : (
                  <>
                    {renderStars(review.rating)}
                    <span className="text-emerald-600 text-sm font-medium">
                      ({review.rating}/5) {getRatingText(review.rating)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2">
              {canEdit && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                  title="संपादित करें"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {!isOwner && (
                <button
                  onClick={() => onReport?.(review.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="रिपोर्ट करें"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        
        {/* Review Text */}
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none resize-none"
              placeholder="अपनी समीक्षा लिखें..."
            />
            
            {/* Edit Actions */}
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
              >
                रद्द करें
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim() || editRating === 0}
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                सहेजें
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className={`text-gray-700 leading-relaxed ${
              !isExpanded && review.comment.length > 200 ? 'line-clamp-3' : ''
            }`}>
              {review.comment}
            </p>
            
            {/* Expand/Collapse */}
            {review.comment.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                {isExpanded ? 'कम दिखाएं' : 'और पढ़ें'}
              </button>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Review image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      // Open image in modal/lightbox
                    }}
                  />
                ))}
              </div>
            )}

            {/* Helpful Votes */}
            {review.helpfulVotes !== undefined && (
              <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">सहायक ({review.helpfulVotes})</span>
                  </button>
                  
                  {canEdit && (
                    <button
                      onClick={() => onDelete?.(review.id)}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm">हटाएं</span>
                    </button>
                  )}
                </div>
                
                <span className="text-gray-500 text-sm">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Purchase Badge */}
      {review.isVerifiedPurchase && (
        <div className="px-6 pb-4">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>वेरिफाइड परचेज</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Review List Component
export const ReviewList = ({ 
  reviews = [], 
  onUpdate, 
  onDelete, 
  onReport,
  isLoading = false,
  emptyMessage = "कोई समीक्षा नहीं मिली",
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-emerald-800 mb-2">{emptyMessage}</h3>
        <p className="text-emerald-600">पहली समीक्षा लिखने वाले बनें!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onReport={onReport}
          isEditable={true}
        />
      ))}
    </div>
  );
};

export default ReviewCard;