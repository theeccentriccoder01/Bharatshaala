// Referral Program Component - Bharatshala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, copyToClipboard } from '../../utils/helpers';

const ReferralProgram = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    referrals: [],
    stats: {}
  });
  const [inviteForm, setInviteForm] = useState({
    emails: [''],
    message: 'भारतशाला पर मेरे साथ जुड़ें और पारंपरिक भारतीय उत्पादों की खरीदारी करें!'
  });
  const [showInviteForm, setShowInviteForm] = useState(false);

  const referralTiers = [
    {
      tier: 'ब्रॉन्ज',
      minReferrals: 0,
      maxReferrals: 4,
      commission: 5,
      bonus: 0,
      color: 'orange',
      icon: '🥉'
    },
    {
      tier: 'सिल्वर',
      minReferrals: 5,
      maxReferrals: 14,
      commission: 7.5,
      bonus: 500,
      color: 'gray',
      icon: '🥈'
    },
    {
      tier: 'गोल्ड',
      minReferrals: 15,
      maxReferrals: 49,
      commission: 10,
      bonus: 1500,
      color: 'yellow',
      icon: '🥇'
    },
    {
      tier: 'प्लेटिनम',
      minReferrals: 50,
      maxReferrals: Infinity,
      commission: 15,
      bonus: 5000,
      color: 'purple',
      icon: '💎'
    }
  ];

  const rewardTypes = [
    {
      type: 'signup',
      title: 'साइन अप बोनस',
      description: 'जब कोई आपके कोड से रजिस्टर करता है',
      reward: '₹100',
      icon: '🎁'
    },
    {
      type: 'first_order',
      title: 'पहला ऑर्डर',
      description: 'जब रेफर किया गया व्यक्ति पहला ऑर्डर करता है',
      reward: '₹500',
      icon: '🛍️'
    },
    {
      type: 'commission',
      title: 'कमीशन',
      description: 'हर ऑर्डर पर कमीशन (टियर के अनुसार)',
      reward: '5-15%',
      icon: '💰'
    },
    {
      type: 'milestone',
      title: 'माइलस्टोन बोनस',
      description: 'टियर अपग्रेड पर विशेष बोनस',
      reward: '₹500-5000',
      icon: '🏆'
    }
  ];

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'green',
      shareUrl: 'https://wa.me/?text='
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'blue',
      shareUrl: 'https://www.facebook.com/sharer/sharer.php?u='
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'blue',
      shareUrl: 'https://twitter.com/intent/tweet?text='
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'blue',
      shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url='
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'blue',
      shareUrl: 'https://t.me/share/url?url='
    }
  ];

  useEffect(() => {
    trackPageView('referral_program');
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/user/referral-data');
      if (response.success) {
        setReferralData(response.data);
      }
    } catch (error) {
      console.error('Failed to load referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = async () => {
    const success = await copyToClipboard(referralData.referralCode);
    if (success) {
      trackEvent('referral_code_copied', {
        userId: user?.id,
        referralCode: referralData.referralCode
      });
      alert('रेफरल कोड कॉपी हो गया!');
    } else {
      alert('कॉपी करने में समस्या हुई');
    }
  };

  const handleShareToSocial = (platform) => {
    const referralUrl = `https://bharatshala.com/signup?ref=${referralData.referralCode}`;
    const shareText = `भारतशाला पर जुड़ें और पारंपरिक भारतीय उत्पादों की खरीदारी करें! मेरा रेफरल कोड: ${referralData.referralCode}`;
    
    const shareUrl = platform.shareUrl + encodeURIComponent(
      platform.name === 'WhatsApp' || platform.name === 'Telegram' 
        ? `${shareText} ${referralUrl}`
        : referralUrl
    );

    window.open(shareUrl, '_blank');
    
    trackEvent('referral_shared', {
      platform: platform.name,
      userId: user?.id,
      referralCode: referralData.referralCode
    });
  };

  const handleSendInvites = async (e) => {
    e.preventDefault();
    
    try {
      const validEmails = inviteForm.emails.filter(email => email.trim() !== '');
      if (validEmails.length === 0) {
        alert('कृपया कम से कम एक ईमेल पता दर्ज करें');
        return;
      }

      const response = await apiService.post('/user/send-referral-invites', {
        emails: validEmails,
        message: inviteForm.message,
        referralCode: referralData.referralCode
      });

      if (response.success) {
        trackEvent('referral_invites_sent', {
          count: validEmails.length,
          userId: user?.id
        });
        alert('इनवाइट्स सफलतापूर्वक भेजे गए!');
        setInviteForm({ emails: [''], message: inviteForm.message });
        setShowInviteForm(false);
      }
    } catch (error) {
      console.error('Failed to send invites:', error);
      alert('इनवाइट्स भेजने में समस्या हुई');
    }
  };

  const addEmailField = () => {
    setInviteForm({
      ...inviteForm,
      emails: [...inviteForm.emails, '']
    });
  };

  const removeEmailField = (index) => {
    const newEmails = inviteForm.emails.filter((_, i) => i !== index);
    setInviteForm({
      ...inviteForm,
      emails: newEmails.length > 0 ? newEmails : ['']
    });
  };

  const updateEmail = (index, value) => {
    const newEmails = [...inviteForm.emails];
    newEmails[index] = value;
    setInviteForm({
      ...inviteForm,
      emails: newEmails
    });
  };

  const getCurrentTier = () => {
    return referralTiers.find(tier => 
      referralData.totalReferrals >= tier.minReferrals && 
      referralData.totalReferrals <= tier.maxReferrals
    ) || referralTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    return referralTiers.find(tier => tier.minReferrals > currentTier.maxReferrals);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="रेफरल डेटा लोड हो रहा है..." />
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <>
      <Helmet>
        <title>रेफरल प्रोग्राम - भारतशाला | Referral Program</title>
        <meta name="description" content="दोस्तों को रेफर करें और पैसे कमाएं। हर रेफरल पर बोनस और कमीशन पाएं।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">रेफरल प्रोग्राम</h1>
                <p className="text-xl opacity-90">
                  दोस्तों को इनवाइट करें और ₹500 तक कमाएं!
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">{currentTier.icon}</div>
                <div className="text-lg font-semibold">{currentTier.tier} स्तर</div>
                <div className="text-sm opacity-80">{currentTier.commission}% कमीशन</div>
              </div>
            </div>
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
                  <p className="text-sm text-gray-600 mb-1">कुल रेफरल्स</p>
                  <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">👥</span>
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
                  <p className="text-sm text-gray-600 mb-1">कुल कमाई</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(referralData.totalEarnings)}</p>
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
                  <p className="text-sm text-gray-600 mb-1">पेंडिंग अमाउंट</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(referralData.pendingEarnings)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-2xl">⏳</span>
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
                  <p className="text-sm text-gray-600 mb-1">कमीशन रेट</p>
                  <p className="text-2xl font-bold text-gray-900">{currentTier.commission}%</p>
                </div>
                <div className={`bg-${currentTier.color}-100 p-3 rounded-full`}>
                  <span className="text-2xl">{currentTier.icon}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Referral Code & Sharing */}
            <div className="lg:col-span-2 space-y-6">
              {/* Referral Code */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">आपका रेफरल कोड</h2>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">रेफरल कोड</p>
                      <p className="text-2xl font-bold text-purple-600">{referralData.referralCode}</p>
                    </div>
                    <button
                      onClick={handleCopyReferralCode}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      कॉपी करें
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">रेफरल लिंक</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 break-all">
                    https://bharatshala.com/signup?ref={referralData.referralCode}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {socialPlatforms.map((platform, index) => (
                    <button
                      key={index}
                      onClick={() => handleShareToSocial(platform)}
                      className={`flex items-center space-x-2 px-4 py-2 bg-${platform.color}-600 text-white rounded-lg hover:bg-${platform.color}-700 transition-colors duration-200`}
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Email Invites */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">ईमेल इनवाइट</h2>
                  <button
                    onClick={() => setShowInviteForm(!showInviteForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {showInviteForm ? 'छुपाएं' : 'इनवाइट भेजें'}
                  </button>
                </div>

                {showInviteForm && (
                  <form onSubmit={handleSendInvites} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ईमेल पते
                      </label>
                      {inviteForm.emails.map((email, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => updateEmail(index, e.target.value)}
                            placeholder="friend@example.com"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {inviteForm.emails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmailField(index)}
                              className="text-red-600 hover:text-red-800 p-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEmailField}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + और ईमेल जोड़ें
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        संदेश (वैकल्पिक)
                      </label>
                      <textarea
                        rows={3}
                        value={inviteForm.message}
                        onChange={(e) => setInviteForm({...inviteForm, message: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      इनवाइट भेजें
                    </button>
                  </form>
                )}
              </motion.div>

              {/* Recent Referrals */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">हाल के रेफरल्स</h2>
                
                {referralData.referrals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">अभी तक कोई रेफरल नहीं</h3>
                    <p className="text-gray-600">अपने दोस्तों को इनवाइट करें और कमाई शुरू करें!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referralData.referrals.slice(0, 5).map((referral, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-lg">👤</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{referral.name || 'नाम नहीं मिला'}</p>
                            <p className="text-sm text-gray-600">{referral.email}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(referral.joinedAt).toLocaleDateString('hi-IN')} को जॉइन किया
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(referral.earnings || 0)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {referral.status === 'active' ? 'सक्रिय' : 
                             referral.status === 'pending' ? 'प्रतीक्षा में' : 'निष्क्रिय'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tier Progress */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">टियर प्रोग्रेस</h3>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">वर्तमान: {currentTier.tier}</span>
                    {nextTier && (
                      <span className="text-sm text-gray-600">अगला: {nextTier.tier}</span>
                    )}
                  </div>
                  
                  {nextTier && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`bg-${currentTier.color}-600 h-2 rounded-full`}
                          style={{
                            width: `${Math.min(100, (referralData.totalReferrals / nextTier.minReferrals) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {nextTier.minReferrals - referralData.totalReferrals} और रेफरल्स {nextTier.tier} टियर के लिए
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {referralTiers.map((tier, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        tier.tier === currentTier.tier 
                          ? `border-${tier.color}-500 bg-${tier.color}-50` 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{tier.icon}</span>
                          <span className="font-semibold">{tier.tier}</span>
                        </div>
                        <span className="text-sm text-gray-600">{tier.commission}%</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {tier.minReferrals === 0 ? '0' : tier.minReferrals}
                        {tier.maxReferrals === Infinity ? '+' : `-${tier.maxReferrals}`} रेफरल्स
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Reward Types */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">रिवार्ड्स</h3>
                <div className="space-y-4">
                  {rewardTypes.map((reward, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{reward.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{reward.description}</p>
                        <p className="text-green-600 font-semibold">{reward.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-blue-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-3">नियम और शर्तें</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• रेफरल बोनस 30 दिन में क्रेडिट होगा</li>
                  <li>• मिनिमम पेआउट ₹1000 है</li>
                  <li>• सेल्फ रेफरल की अनुमति नहीं है</li>
                  <li>• फ्रॉड एक्टिविटी पर अकाउंट बैन हो सकता है</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferralProgram;