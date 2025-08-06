// Reward Points Component - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';

const RewardPoints = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState({
    totalPoints: 0,
    availablePoints: 0,
    usedPoints: 0,
    expiringPoints: 0,
    transactions: [],
    rewards: []
  });
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'ओवरव्यू', icon: '📊' },
    { id: 'earn', name: 'कमाएं', icon: '💰' },
    { id: 'redeem', name: 'रिडीम करें', icon: '🎁' },
    { id: 'history', name: 'हिस्ट्री', icon: '📜' }
  ];

  const earnMethods = [
    {
      method: 'साइन अप बोनस',
      points: 100,
      description: 'अकाउंट बनाने पर',
      icon: '🎯',
      status: 'completed'
    },
    {
      method: 'ऑर्डर पर पॉइंट्स',
      points: '1 पॉइंट/₹10',
      description: 'हर ऑर्डर पर मिलते हैं',
      icon: '🛍️',
      status: 'active'
    },
    {
      method: 'रिव्यू लिखने पर',
      points: 50,
      description: 'प्रोडक्ट रिव्यू लिखने पर',
      icon: '⭐',
      status: 'active'
    },
    {
      method: 'रेफरल बोनस',
      points: 500,
      description: 'दोस्त को रेफर करने पर',
      icon: '👥',
      status: 'active'
    },
    {
      method: 'सोशल शेयर',
      points: 25,
      description: 'प्रोडक्ट शेयर करने पर',
      icon: '📱',
      status: 'active'
    },
    {
      method: 'न्यूज़लेटर सब्सक्रिप्शन',
      points: 75,
      description: 'न्यूज़लेटर सब्सक्राइब करने पर',
      icon: '📧',
      status: 'pending'
    },
    {
      method: 'बर्थडे बोनस',
      points: 200,
      description: 'जन्मदिन पर विशेष बोनस',
      icon: '🎂',
      status: 'annual'
    },
    {
      method: 'फेस्टिवल बोनस',
      points: 300,
      description: 'त्योहारों पर विशेष बोनस',
      icon: '🎉',
      status: 'seasonal'
    }
  ];

  const redeemOptions = [
    {
      type: 'discount',
      title: '₹50 छूट',
      points: 500,
      description: '₹500+ के ऑर्डर पर',
      icon: '💸',
      available: true
    },
    {
      type: 'discount',
      title: '₹100 छूट',
      points: 1000,
      description: '₹1000+ के ऑर्डर पर',
      icon: '💸',
      available: true
    },
    {
      type: 'discount',
      title: '₹250 छूट',
      points: 2500,
      description: '₹2500+ के ऑर्डर पर',
      icon: '💸',
      available: true
    },
    {
      type: 'discount',
      title: '₹500 छूट',
      points: 5000,
      description: '₹5000+ के ऑर्डर पर',
      icon: '💸',
      available: true
    },
    {
      type: 'shipping',
      title: 'फ्री शिपिंग',
      points: 300,
      description: 'अगले 3 ऑर्डर्स पर',
      icon: '🚚',
      available: true
    },
    {
      type: 'gift',
      title: 'गिफ्ट हैम्पर',
      points: 10000,
      description: 'स्पेशल गिफ्ट हैम्पर',
      icon: '🎁',
      available: false
    },
    {
      type: 'voucher',
      title: 'अमेज़न वाउचर',
      points: 1500,
      description: '₹100 अमेज़न वाउचर',
      icon: '🎟️',
      available: true
    },
    {
      type: 'premium',
      title: 'प्रीमियम मेंबरशिप',
      points: 15000,
      description: '1 साल प्रीमियम एक्सेस',
      icon: '👑',
      available: false
    }
  ];

  const statusColors = {
    earned: 'green',
    redeemed: 'blue',
    expired: 'red',
    pending: 'yellow'
  };

  useEffect(() => {
    trackPageView('reward_points');
    loadRewardData();
  }, []);

  const loadRewardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/user/reward-points');
      if (response.success) {
        setRewardData(response.data);
      }
    } catch (error) {
      console.error('Failed to load reward data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (reward) => {
    if (rewardData.availablePoints < reward.points) {
      alert('पर्याप्त पॉइंट्स नहीं हैं');
      return;
    }

    if (!reward.available) {
      alert('यह रिवार्ड फिलहाल उपलब्ध नहीं है');
      return;
    }

    try {
      const response = await apiService.post('/user/redeem-reward', {
        type: reward.type,
        title: reward.title,
        points: reward.points
      });

      if (response.success) {
        await loadRewardData();
        trackEvent('reward_redeemed', {
          rewardType: reward.type,
          rewardTitle: reward.title,
          pointsUsed: reward.points,
          userId: user?.id
        });
        alert(`${reward.title} सफलतापूर्वक रिडीम हुआ!`);
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert('रिवार्ड रिडीम करने में समस्या हुई');
    }
  };

  const getPointsExpiringInfo = () => {
    const expiringIn30Days = rewardData.expiringPoints || 0;
    if (expiringIn30Days > 0) {
      return {
        message: `${expiringIn30Days} पॉइंट्स 30 दिन में एक्सपायर हो जाएंगे`,
        color: 'red'
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="रिवार्ड पॉइंट्स लोड हो रहे हैं..." />
      </div>
    );
  }

  const expiringInfo = getPointsExpiringInfo();

  return (
    <>
      <Helmet>
        <title>रिवार्ड पॉइंट्स - भारतशाला | Reward Points</title>
        <meta name="description" content="अपने रिवार्ड पॉइंट्स देखें और उन्हें छूट और गिफ्ट्स के लिए रिडीम करें।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg p-8 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">रिवार्ड पॉइंट्स</h1>
                <p className="text-xl opacity-90">
                  खरीदारी करें, पॉइंट्स कमाएं और रिवार्ड्स पाएं!
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{rewardData.availablePoints}</div>
                <div className="text-lg">उपलब्ध पॉइंट्स</div>
              </div>
            </div>
            
            {expiringInfo && (
              <div className={`mt-4 p-3 bg-${expiringInfo.color}-100 text-${expiringInfo.color}-800 rounded-lg`}>
                <p className="text-sm">⚠️ {expiringInfo.message}</p>
              </div>
            )}
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">कुल पॉइंट्स</p>
                  <p className="text-2xl font-bold text-gray-900">{rewardData.totalPoints}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">उपलब्ध पॉइंट्स</p>
                  <p className="text-2xl font-bold text-gray-900">{rewardData.availablePoints}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">इस्तेमाल किए गए</p>
                  <p className="text-2xl font-bold text-gray-900">{rewardData.usedPoints}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">पॉइंट्स वैल्यू</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(rewardData.availablePoints / 10)}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      selectedTab === tab.id
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">पॉइंट्स का मूल्य</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">• 10 पॉइंट्स = ₹1 की छूट</p>
                        <p className="text-sm text-gray-600">• 500 पॉइंट्स = ₹50 डिस्काउंट वाउचर</p>
                        <p className="text-sm text-gray-600">• पॉइंट्स की कोई एक्सपायरी नहीं (1 साल तक)</p>
                        <p className="text-sm text-gray-600">• मिनिमम रिडीम: 300 पॉइंट्स</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">कैसे कमाएं?</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">• हर ₹10 के ऑर्डर पर 1 पॉइंट</p>
                        <p className="text-sm text-gray-600">• रिव्यू लिखने पर 50 पॉइंट्स</p>
                        <p className="text-sm text-gray-600">• रेफरल पर 500 पॉइंट्स</p>
                        <p className="text-sm text-gray-600">• सोशल शेयर पर 25 पॉइंट्स</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">प्रो टिप्स</h3>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• बड़े ऑर्डर्स से ज्यादा पॉइंट्स मिलते हैं</li>
                      <li>• फेस्टिवल सीज़न में डबल पॉइंट्स</li>
                      <li>• प्रीमियम मेंबर्स को 50% बोनस पॉइंट्स</li>
                      <li>• पॉइंट्स को छूट के साथ कॉम्बाइन कर सकते हैं</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Earn Tab */}
              {selectedTab === 'earn' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {earnMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-colors duration-200 ${
                        method.status === 'completed' 
                          ? 'border-green-200 bg-green-50' :
                        method.status === 'active'
                          ? 'border-blue-200 bg-blue-50' :
                        method.status === 'pending'
                          ? 'border-yellow-200 bg-yellow-50' :
                          'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{method.method}</h3>
                            <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                            <p className="text-lg font-bold text-green-600">{method.points} पॉइंट्स</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          method.status === 'completed' ? 'bg-green-100 text-green-800' :
                          method.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          method.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {method.status === 'completed' ? 'पूर्ण' :
                           method.status === 'active' ? 'सक्रिय' :
                           method.status === 'pending' ? 'प्रतीक्षा में' : 'आगामी'}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Redeem Tab */}
              {selectedTab === 'redeem' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {redeemOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                        option.available && rewardData.availablePoints >= option.points
                          ? 'border-green-200 bg-white'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <span className="text-4xl mb-3 block">{option.icon}</span>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{option.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <div className="text-2xl font-bold text-yellow-600 mb-4">
                          {option.points} पॉइंट्स
                        </div>
                        
                        <button
                          onClick={() => handleRedeemReward(option)}
                          disabled={!option.available || rewardData.availablePoints < option.points}
                          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                            option.available && rewardData.availablePoints >= option.points
                              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {!option.available ? 'अनुपलब्ध' :
                           rewardData.availablePoints < option.points ? 'पर्याप्त पॉइंट्स नहीं' :
                           'रिडीम करें'}
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* History Tab */}
              {selectedTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {rewardData.transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📜</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई ट्रांज़ैक्शन नहीं मिली</h3>
                      <p className="text-gray-600">अभी तक कोई पॉइंट्स ट्रांज़ैक्शन नहीं हुई है</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rewardData.transactions.map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full bg-${statusColors[transaction.type]}-500`}></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                              <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                              {transaction.orderId && (
                                <p className="text-xs text-gray-500">ऑर्डर ID: {transaction.orderId}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : '-'}{transaction.points} पॉइंट्स
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.type === 'earned' ? 'कमाए' : 
                               transaction.type === 'redeemed' ? 'रिडीम किए' :
                               transaction.type === 'expired' ? 'एक्सपायर हुए' : 'प्रतीक्षा में'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardPoints;