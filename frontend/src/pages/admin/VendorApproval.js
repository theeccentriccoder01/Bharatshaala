import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const VendorApproval = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get, put, post } = useAPI();
  const { showSuccess, showError, showInfo } = useNotification();

  const [loading, setLoading] = useState(true);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [rejectedVendors, setRejectedVendors] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const tabs = [
    { id: 'pending', name: 'पेंडिंग अप्रूवल', icon: '⏳', count: 0 },
    { id: 'approved', name: 'अप्रूव्ड', icon: '✅', count: 0 },
    { id: 'rejected', name: 'रिजेक्टेड', icon: '❌', count: 0 }
  ];

  const rejectionReasons = [
    'अधूरे दस्तावेज़',
    'गलत जानकारी',
    'डुप्लिकेट रजिस्ट्रेशन',
    'बिज़नेस सत्यापन नहीं हुआ',
    'नीति का उल्लंघन',
    'संदिग्ध गतिविधि',
    'अन्य कारण'
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadVendorData();
  }, [isAuthenticated, user]);

  const loadVendorData = async () => {
    setLoading(true);
    try {
      const response = await get('/admin/vendor-applications');
      if (response.success) {
        setPendingVendors(response.pending || []);
        setApprovedVendors(response.approved || []);
        setRejectedVendors(response.rejected || []);
      }
    } catch (error) {
      console.error('Error loading vendor data:', error);
      // Mock data for demo
      const mockPendingVendors = [
        {
          id: 1,
          businessName: 'गुजरात टेक्सटाइल्स',
          ownerName: 'राज पटेल',
          email: 'raj.patel@gujarattextiles.com',
          phone: '+91 9876543210',
          city: 'अहमदाबाद',
          state: 'गुजरात',
          businessType: 'व्होलसेल',
          category: 'कपड़े',
          gstNumber: '24ABCDE1234F1Z5',
          panNumber: 'ABCDE1234F',
          aadharNumber: '1234-5678-9012',
          bankAccount: {
            accountNumber: '12345678901234',
            ifsc: 'SBIN0001234',
            bankName: 'State Bank of India'
          },
          documents: {
            gstCertificate: '/documents/gst-cert-1.pdf',
            panCard: '/documents/pan-1.pdf',
            aadharCard: '/documents/aadhar-1.pdf',
            bankPassbook: '/documents/bank-1.pdf',
            businessLicense: '/documents/license-1.pdf'
          },
          applicationDate: '2025-08-01T10:30:00Z',
          businessDescription: 'हम पारंपरिक गुजराती कपड़ों और टेक्सटाइल में विशेषज्ञ हैं। हमारे पास 15 साल का अनुभव है।',
          expectedMonthlyOrders: 500,
          productCategories: ['साड़ी', 'कुर्ता', 'चूड़ीदार', 'दुपट्टा'],
          references: [
            { name: 'सुरेश शाह', phone: '+91 9876543211', relation: 'बिज़नेस पार्टनर' }
          ],
          socialMedia: {
            facebook: 'gujarattextiles',
            instagram: 'gujarattextiles_official'
          },
          score: 85
        },
        {
          id: 2,
          businessName: 'केरल स्पाइसेस एम्पोरियम',
          ownerName: 'रमेश नायर',
          email: 'ramesh@keralaspices.com',
          phone: '+91 9876543213',
          city: 'कोच्चि',
          state: 'केरल',
          businessType: 'मैन्युफैक्चरर',
          category: 'मसाले',
          gstNumber: '32FGHIJ5678G2A6',
          panNumber: 'FGHIJ5678G',
          aadharNumber: '5678-9012-3456',
          bankAccount: {
            accountNumber: '56789012345678',
            ifsc: 'HDFC0001234',
            bankName: 'HDFC Bank'
          },
          documents: {
            gstCertificate: '/documents/gst-cert-2.pdf',
            panCard: '/documents/pan-2.pdf',
            aadharCard: '/documents/aadhar-2.pdf',
            bankPassbook: '/documents/bank-2.pdf',
            businessLicense: '/documents/license-2.pdf'
          },
          applicationDate: '2025-08-02T14:15:00Z',
          businessDescription: 'प्रामाणिक केरल के मसालों का निर्यात और विक्रय। फार्म टू टेबल कॉन्सेप्ट।',
          expectedMonthlyOrders: 300,
          productCategories: ['काली मिर्च', 'इलायची', 'जायफल', 'लौंग'],
          references: [
            { name: 'सुनील कुमार', phone: '+91 9876543214', relation: 'सप्लायर' }
          ],
          socialMedia: {
            facebook: 'keralaspices',
            instagram: 'kerala_spices_emporium'
          },
          score: 92
        },
        {
          id: 3,
          businessName: 'राजस्थान हैंडीक्राफ्ट्स',
          ownerName: 'अरुण शर्मा',
          email: 'arun@rajasthanhandicrafts.com',
          phone: '+91 9876543215',
          city: 'जोधपुर',
          state: 'राजस्थान',
          businessType: 'आर्टिजन',
          category: 'हस्तशिल्प',
          gstNumber: '08KLMNO9012H3B7',
          panNumber: 'KLMNO9012H',
          aadharNumber: '9012-3456-7890',
          bankAccount: {
            accountNumber: '90123456789012',
            ifsc: 'ICIC0001234',
            bankName: 'ICICI Bank'
          },
          documents: {
            gstCertificate: '/documents/gst-cert-3.pdf',
            panCard: '/documents/pan-3.pdf',
            aadharCard: '/documents/aadhar-3.pdf',
            bankPassbook: '/documents/bank-3.pdf',
            businessLicense: '/documents/license-3.pdf'
          },
          applicationDate: '2025-08-03T09:45:00Z',
          businessDescription: 'राजस्थानी पारंपरिक हस्तशिल्प और कलाकृतियों के निर्माता और विक्रेता।',
          expectedMonthlyOrders: 200,
          productCategories: ['लकड़ी का काम', 'मेटल क्राफ्ट', 'पेंटिंग्स', 'सिरेमिक्स'],
          references: [
            { name: 'विकास गुप्ता', phone: '+91 9876543216', relation: 'डिस्ट्रिब्यूटर' }
          ],
          socialMedia: {
            facebook: 'rajasthanhandicrafts',
            instagram: 'rajasthan_handicrafts'
          },
          score: 78
        }
      ];

      setPendingVendors(mockPendingVendors);
      setApprovedVendors([]);
      setRejectedVendors([]);
    }
    setLoading(false);
  };

  const handleApproveVendor = async (vendorId) => {
    if (!approvalNotes.trim()) {
      showError('कृपया अप्रूवल नोट्स डालें');
      return;
    }

    try {
      const response = await put(`/admin/vendors/${vendorId}/approve`, {
        notes: approvalNotes
      });

      if (response.success) {
        showSuccess('विक्रेता सफलतापूर्वक अप्रूव हो गया!');
        setApprovalNotes('');
        setShowVendorDetails(false);
        loadVendorData();
      }
    } catch (error) {
      showError('अप्रूवल करने में त्रुटि');
    }
  };

  const handleRejectVendor = async (vendorId) => {
    if (!rejectionReason.trim()) {
      showError('कृपया रिजेक्शन का कारण चुनें');
      return;
    }

    try {
      const response = await put(`/admin/vendors/${vendorId}/reject`, {
        reason: rejectionReason
      });

      if (response.success) {
        showSuccess('विक्रेता रिजेक्ट कर दिया गया');
        setRejectionReason('');
        setShowVendorDetails(false);
        loadVendorData();
      }
    } catch (error) {
      showError('रिजेक्ट करने में त्रुटि');
    }
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
    setApprovalNotes('');
    setRejectionReason('');
  };

  const calculateCompletionScore = (vendor) => {
    let score = 0;
    const fields = [
      vendor.businessName,
      vendor.ownerName,
      vendor.email,
      vendor.phone,
      vendor.gstNumber,
      vendor.panNumber,
      vendor.businessDescription
    ];

    fields.forEach(field => {
      if (field && field.trim()) score += 10;
    });

    if (vendor.documents) {
      Object.values(vendor.documents).forEach(doc => {
        if (doc) score += 5;
      });
    }

    return Math.min(score, 100);
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

  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'pending': return pendingVendors;
      case 'approved': return approvedVendors;
      case 'rejected': return rejectedVendors;
      default: return [];
    }
  };

  // Update tab counts
  tabs[0].count = pendingVendors.length;
  tabs[1].count = approvedVendors.length;
  tabs[2].count = rejectedVendors.length;

  if (loading) {
    return <LoadingSpinner message="विक्रेता डेटा लोड हो रहा है..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                विक्रेता अप्रूवल 🏪
              </h1>
              <p className="text-slate-600 text-lg">
                नए विक्रेता आवेदनों की समीक्षा और अप्रूवल
              </p>
            </div>
            
            <button
              onClick={() => navigate('/admin')}
              className="bg-slate-500 text-white px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors duration-200"
            >
              ← डैशबोर्ड पर वापस
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-slate-100' : 'bg-slate-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {getCurrentTabData().map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{vendor.businessName}</h3>
                  <p className="text-slate-600">{vendor.ownerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${
                    vendor.score >= 85 ? 'bg-green-500' :
                    vendor.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm font-medium">{vendor.score}%</span>
                </div>
              </div>

              {/* Business Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">श्रेणी:</span>
                  <span className="font-medium">{vendor.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">स्थान:</span>
                  <span className="font-medium">{vendor.city}, {vendor.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">बिज़नेस टाइप:</span>
                  <span className="font-medium">{vendor.businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">आवेदन दिनांक:</span>
                  <span className="font-medium">{formatDate(vendor.applicationDate)}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">संपर्क जानकारी</h4>
                <div className="space-y-1 text-sm">
                  <div>📧 {vendor.email}</div>
                  <div>📱 {vendor.phone}</div>
                  <div>🏢 GST: {vendor.gstNumber}</div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="mb-4">
                <h4 className="font-semibold text-slate-800 mb-2">प्रोडक्ट कैटेगरी</h4>
                <div className="flex flex-wrap gap-2">
                  {vendor.productCategories.slice(0, 3).map((category, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      {category}
                    </span>
                  ))}
                  {vendor.productCategories.length > 3 && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                      +{vendor.productCategories.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewDetails(vendor)}
                  className="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-200 text-sm font-medium"
                >
                  विवरण देखें
                </button>
                {activeTab === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setApprovalNotes('आवेदन सभी आवश्यकताओं को पूरा करता है।');
                        handleApproveVendor(vendor.id);
                      }}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                    >
                      ✅ अप्रूव
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowVendorDetails(true);
                      }}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                    >
                      ❌ रिजेक्ट
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getCurrentTabData().length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">
              {activeTab === 'pending' ? '⏳' : 
               activeTab === 'approved' ? '✅' : '❌'}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {activeTab === 'pending' ? 'कोई पेंडिंग आवेदन नहीं' :
               activeTab === 'approved' ? 'कोई अप्रूव्ड विक्रेता नहीं' :
               'कोई रिजेक्टेड आवेदन नहीं'}
            </h2>
            <p className="text-slate-600">
              {activeTab === 'pending' ? 'सभी आवेदनों की समीक्षा पूर्ण हो गई है।' :
               activeTab === 'approved' ? 'अभी तक कोई विक्रेता अप्रूव नहीं हुआ है।' :
               'अभी तक कोई आवेदन रिजेक्ट नहीं हुआ है।'}
            </p>
          </div>
        )}

        {/* Vendor Details Modal */}
        {showVendorDetails && selectedVendor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">विक्रेता विवरण</h2>
                <button
                  onClick={() => setShowVendorDetails(false)}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Business Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">बिज़नेस जानकारी</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-600 text-sm">बिज़नेस नाम:</label>
                        <p className="font-medium">{selectedVendor.businessName}</p>
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm">मालिक का नाम:</label>
                        <p className="font-medium">{selectedVendor.ownerName}</p>
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm">श्रेणी:</label>
                        <p className="font-medium">{selectedVendor.category}</p>
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm">बिज़नेस टाइप:</label>
                        <p className="font-medium">{selectedVendor.businessType}</p>
                      </div>
                      <div>
                        <label className="text-slate-600 text-sm">विवरण:</label>
                        <p className="font-medium">{selectedVendor.businessDescription}</p>
                      </div>
                    </div>
                  </div>

                  {/* Legal Documents */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">कानूनी दस्तावेज़</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>GST नंबर:</span>
                        <span className="font-medium">{selectedVendor.gstNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PAN नंबर:</span>
                        <span className="font-medium">{selectedVendor.panNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>आधार नंबर:</span>
                        <span className="font-medium">{selectedVendor.aadharNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">बैंक विवरण</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>बैंक नाम:</span>
                        <span className="font-medium">{selectedVendor.bankAccount.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>खाता नंबर:</span>
                        <span className="font-medium">{selectedVendor.bankAccount.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IFSC कोड:</span>
                        <span className="font-medium">{selectedVendor.bankAccount.ifsc}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">संपर्क जानकारी</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>ईमेल:</span>
                        <span className="font-medium">{selectedVendor.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>फोन:</span>
                        <span className="font-medium">{selectedVendor.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>शहर:</span>
                        <span className="font-medium">{selectedVendor.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>राज्य:</span>
                        <span className="font-medium">{selectedVendor.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">प्रोडक्ट कैटेगरी</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.productCategories.map((category, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">अपलोडेड दस्तावेज़</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedVendor.documents).map(([docType, docUrl]) => (
                        <div key={docType} className="flex justify-between items-center">
                          <span className="text-sm capitalize">
                            {docType === 'gstCertificate' ? 'GST प्रमाणपत्र' :
                             docType === 'panCard' ? 'PAN कार्ड' :
                             docType === 'aadharCard' ? 'आधार कार्ड' :
                             docType === 'bankPassbook' ? 'बैंक पासबुक' :
                             docType === 'businessLicense' ? 'बिज़नेस लाइसेंस' : docType}:
                          </span>
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            📄 देखें
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* References */}
                  {selectedVendor.references && selectedVendor.references.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">संदर्भ</h3>
                      <div className="space-y-2">
                        {selectedVendor.references.map((ref, index) => (
                          <div key={index} className="bg-slate-50 rounded-lg p-3">
                            <div className="font-medium">{ref.name}</div>
                            <div className="text-sm text-slate-600">{ref.phone}</div>
                            <div className="text-sm text-slate-600">{ref.relation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Completion Score */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">पूर्णता स्कोर</h3>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>प्रोफाइल पूर्णता:</span>
                        <span className="font-bold text-2xl">{selectedVendor.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedVendor.score >= 85 ? 'bg-green-500' :
                            selectedVendor.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedVendor.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              {activeTab === 'pending' && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Approval Section */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h4 className="font-bold text-green-800 mb-4">✅ अप्रूव करें</h4>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="अप्रूवल नोट्स लिखें..."
                        rows={4}
                        className="w-full px-4 py-3 border border-green-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                      ></textarea>
                      <button
                        onClick={() => handleApproveVendor(selectedVendor.id)}
                        className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                      >
                        विक्रेता को अप्रूव करें
                      </button>
                    </div>

                    {/* Rejection Section */}
                    <div className="bg-red-50 rounded-xl p-6">
                      <h4 className="font-bold text-red-800 mb-4">❌ रिजेक्ट करें</h4>
                      <select
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-4 py-3 border border-red-200 rounded-lg focus:border-red-500 focus:outline-none mb-4"
                      >
                        <option value="">रिजेक्शन का कारण चुनें</option>
                        {rejectionReasons.map((reason, index) => (
                          <option key={index} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRejectVendor(selectedVendor.id)}
                        className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                      >
                        विक्रेता को रिजेक्ट करें
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowVendorDetails(false)}
                  className="px-8 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorApproval;
