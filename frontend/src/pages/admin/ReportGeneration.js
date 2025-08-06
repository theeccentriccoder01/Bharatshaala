// Report Generation Component for Bharatshala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import apiService from '../apiService';
import { helpers } from '../helpers';

const ReportGeneration = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [reportConfig, setReportConfig] = useState({
    type: 'sales',
    dateRange: 'last30days',
    startDate: '',
    endDate: '',
    format: 'pdf',
    includeCharts: true,
    groupBy: 'daily',
    filters: {}
  });

  const reportTypes = [
    {
      key: 'sales',
      name: 'बिक्री रिपोर्ट',
      description: 'बिक्री डेटा और ट्रेंड्स',
      icon: '📊',
      metrics: ['revenue', 'orders', 'conversion']
    },
    {
      key: 'inventory',
      name: 'इन्वेंट्री रिपोर्ट',
      description: 'स्टॉक और इन्वेंट्री स्थिति',
      icon: '📦',
      metrics: ['stock_levels', 'low_stock', 'out_of_stock']
    },
    {
      key: 'customers',
      name: 'ग्राहक रिपोर्ट',
      description: 'ग्राहक डेटा और व्यवहार',
      icon: '👥',
      metrics: ['new_customers', 'retention', 'lifetime_value']
    },
    {
      key: 'vendors',
      name: 'विक्रेता रिपोर्ट',
      description: 'विक्रेता प्रदर्शन और कमीशन',
      icon: '🏪',
      metrics: ['vendor_sales', 'commission', 'products']
    },
    {
      key: 'financial',
      name: 'वित्तीय रिपोर्ट',
      description: 'राजस्व, लागत और लाभ',
      icon: '💰',
      metrics: ['revenue', 'costs', 'profit_margin']
    },
    {
      key: 'marketing',
      name: 'मार्केटिंग रिपोर्ट',
      description: 'कैंपेन प्रदर्शन और ROI',
      icon: '📈',
      metrics: ['campaign_performance', 'roi', 'traffic_sources']
    }
  ];

  const dateRanges = [
    { key: 'today', name: 'आज' },
    { key: 'yesterday', name: 'कल' },
    { key: 'last7days', name: 'पिछले 7 दिन' },
    { key: 'last30days', name: 'पिछले 30 दिन' },
    { key: 'thismonth', name: 'इस महीने' },
    { key: 'lastmonth', name: 'पिछले महीने' },
    { key: 'thisquarter', name: 'इस तिमाही' },
    { key: 'thisyear', name: 'इस साल' },
    { key: 'custom', name: 'कस्टम रेंज' }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/reports');
      
      if (response.success) {
        setReports(response.data);
      }
    } catch (error) {
      showError('रिपोर्ट लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportConfig.type) {
      showError('कृपया रिपोर्ट टाइप चुनें');
      return;
    }

    setGenerating(true);

    try {
      const response = await apiService.post('/admin/reports/generate', {
        ...reportConfig,
        generatedBy: user.id
      });

      if (response.success) {
        showSuccess('रिपोर्ट जेनरेट हो रही है');
        setShowModal(false);
        loadReports();
        
        trackEvent('report_generated', {
          reportType: reportConfig.type,
          dateRange: reportConfig.dateRange,
          format: reportConfig.format
        });
      }
    } catch (error) {
      showError('रिपोर्ट जेनरेट करने में त्रुटि');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await apiService.get(`/admin/reports/${reportId}/download`, {
        responseType: 'blob'
      });

      const report = reports.find(r => r.id === reportId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${report.name}.${report.format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      trackEvent('report_downloaded', {
        reportId,
        reportType: report.type
      });
    } catch (error) {
      showError('रिपोर्ट डाउनलोड करने में त्रुटि');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('क्या आप वाकई इस रिपोर्ट को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      await apiService.delete(`/admin/reports/${reportId}`);
      showSuccess('रिपोर्ट डिलीट हो गई');
      loadReports();
      
      trackEvent('report_deleted', { reportId });
    } catch (error) {
      showError('रिपोर्ट डिलीट करने में त्रुटि');
    }
  };

  const getReportStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getReportStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'पूर्ण';
      case 'processing': return 'प्रोसेसिंग';
      case 'failed': return 'असफल';
      default: return status;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="रिपोर्ट लोड हो रही हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">रिपोर्ट जेनरेशन</h1>
          <p className="text-gray-600 mt-1">विभिन्न प्रकार की रिपोर्ट्स जेनरेट करें</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          नई रिपोर्ट जेनरेट करें
        </button>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type) => (
          <div
            key={type.key}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => {
              setReportConfig(prev => ({ ...prev, type: type.key }));
              setShowModal(true);
            }}
          >
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">{type.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {type.metrics.map((metric) => (
                <span
                  key={metric}
                  className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">हाल की रिपोर्ट्स</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📊</div>
              <p>कोई रिपोर्ट नहीं मिली</p>
            </div>
          ) : (
            reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getReportStatusColor(report.status)}`}>
                        {getReportStatusLabel(report.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>टाइप: {reportTypes.find(t => t.key === report.type)?.name}</span>
                      <span>•</span>
                      <span>फॉर्मेट: {report.format.toUpperCase()}</span>
                      <span>•</span>
                      <span>बनाया गया: {helpers.date.formatDate(report.createdAt, 'DD MMM YYYY, hh:mm A')}</span>
                      {report.fileSize && (
                        <>
                          <span>•</span>
                          <span>साइज़: {helpers.number.formatFileSize(report.fileSize)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="text-emerald-600 hover:text-emerald-700 px-3 py-1 text-sm"
                      >
                        डाउनलोड करें
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="text-red-600 hover:text-red-700 px-3 py-1 text-sm"
                    >
                      डिलीट करें
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="नई रिपोर्ट जेनरेट करें"
        size="large"
      >
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              रिपोर्ट टाइप *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <div
                  key={type.key}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    reportConfig.type === type.key
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setReportConfig(prev => ({ ...prev, type: type.key }))}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              डेट रेंज *
            </label>
            <select
              value={reportConfig.dateRange}
              onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {dateRanges.map((range) => (
                <option key={range.key} value={range.key}>
                  {range.name}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range */}
          {reportConfig.dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  शुरुआती तारीख *
                </label>
                <input
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  अंतिम तारीख *
                </label>
                <input
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Format and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                फॉर्मेट
              </label>
              <select
                value={reportConfig.format}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ग्रुप बाई
              </label>
              <select
                value={reportConfig.groupBy}
                onChange={(e) => setReportConfig(prev => ({ ...prev, groupBy: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="daily">दैनिक</option>
                <option value="weekly">साप्ताहिक</option>
                <option value="monthly">मासिक</option>
                <option value="quarterly">तिमाही</option>
                <option value="yearly">वार्षिक</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includeCharts}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                चार्ट्स और ग्राफ़्स शामिल करें
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={generating}
            >
              रद्द करें
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={generating || !reportConfig.type}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {generating ? (
                <LoadingSpinner size="small" color="white" />
              ) : (
                'रिपोर्ट जेनरेट करें'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportGeneration;