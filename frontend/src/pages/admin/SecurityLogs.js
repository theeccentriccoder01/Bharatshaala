// Security Logs Component for Bharatshaala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import apiService from '../apiService';
import { helpers } from '../helpers';

const SecurityLogs = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('last7days');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [securityStats, setSecurityStats] = useState({
    totalLogs: 0,
    criticalAlerts: 0,
    suspiciousActivities: 0,
    blockedIPs: 0,
    failedLogins: 0
  });

  const logTypes = [
    { key: 'login_attempt', name: 'लॉगिन प्रयास', icon: '🔐' },
    { key: 'failed_login', name: 'असफल लॉगिन', icon: '❌' },
    { key: 'password_change', name: 'पासवर्ड बदलाव', icon: '🔑' },
    { key: 'suspicious_activity', name: 'संदिग्ध गतिविधि', icon: '⚠️' },
    { key: 'ip_blocked', name: 'IP ब्लॉक', icon: '🚫' },
    { key: 'admin_action', name: 'एडमिन कार्य', icon: '👤' },
    { key: 'data_breach', name: 'डेटा उल्लंघन', icon: '🚨' },
    { key: 'permission_change', name: 'अनुमति परिवर्तन', icon: '🛡️' }
  ];

  const severityLevels = [
    { key: 'low', name: 'कम', color: 'green' },
    { key: 'medium', name: 'मध्यम', color: 'yellow' },
    { key: 'high', name: 'उच्च', color: 'orange' },
    { key: 'critical', name: 'गंभीर', color: 'red' }
  ];

  useEffect(() => {
    loadSecurityLogs();
    loadSecurityStats();
  }, [currentPage, searchTerm, filterSeverity, filterType, dateRange]);

  const loadSecurityLogs = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/security/logs', {
        params: {
          page: currentPage,
          search: searchTerm,
          severity: filterSeverity,
          type: filterType,
          dateRange,
          limit: 20
        }
      });

      if (response.success) {
        setLogs(response.data.logs);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      showError('सिक्योरिटी लॉग्स लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const loadSecurityStats = async () => {
    try {
      const response = await apiService.get('/admin/security/stats', {
        params: { dateRange }
      });

      if (response.success) {
        setSecurityStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load security stats:', error);
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
    
    trackEvent('security_log_viewed', {
      logId: log.id,
      logType: log.type,
      severity: log.severity
    });
  };

  const handleBlockIP = async (ipAddress) => {
    if (!window.confirm(`क्या आप वाकई IP ${ipAddress} को ब्लॉक करना चाहते हैं?`)) {
      return;
    }

    try {
      const response = await apiService.post('/admin/security/block-ip', {
        ipAddress,
        reason: 'Admin manual block',
        blockedBy: user.id
      });

      if (response.success) {
        showSuccess('IP address ब्लॉक हो गया');
        loadSecurityLogs();
        
        trackEvent('ip_blocked_manual', {
          ipAddress,
          adminId: user.id
        });
      }
    } catch (error) {
      showError('IP ब्लॉक करने में त्रुटि');
    }
  };

  const handleResolveAlert = async (logId) => {
    try {
      const response = await apiService.patch(`/admin/security/logs/${logId}/resolve`, {
        resolvedBy: user.id,
        resolvedAt: new Date().toISOString()
      });

      if (response.success) {
        showSuccess('अलर्ट रिज़ॉल्व हो गया');
        loadSecurityLogs();
        
        trackEvent('security_alert_resolved', {
          logId,
          adminId: user.id
        });
      }
    } catch (error) {
      showError('अलर्ट रिज़ॉल्व करने में त्रुटि');
    }
  };

  const getSeverityColor = (severity) => {
    const level = severityLevels.find(s => s.key === severity);
    return level ? level.color : 'gray';
  };

  const getSeverityLabel = (severity) => {
    const level = severityLevels.find(s => s.key === severity);
    return level ? level.name : severity;
  };

  const getLogTypeLabel = (type) => {
    const logType = logTypes.find(t => t.key === type);
    return logType ? logType.name : type;
  };

  const getLogTypeIcon = (type) => {
    const logType = logTypes.find(t => t.key === type);
    return logType ? logType.icon : '📝';
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="सिक्योरिटी लॉग्स लोड हो रहे हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">सिक्योरिटी लॉग्स</h1>
          <p className="text-gray-600 mt-1">सिस्टम सिक्योरिटी की निगरानी करें</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => loadSecurityLogs()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            रीफ्रेश करें
          </button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">कुल लॉग्स</p>
              <p className="text-lg font-semibold text-gray-900">{securityStats.totalLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">🚨</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">गंभीर अलर्ट</p>
              <p className="text-lg font-semibold text-gray-900">{securityStats.criticalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⚠️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">संदिग्ध गतिविधि</p>
              <p className="text-lg font-semibold text-gray-900">{securityStats.suspiciousActivities}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-lg">🚫</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">ब्लॉक्ड IPs</p>
              <p className="text-lg font-semibold text-gray-900">{securityStats.blockedIPs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">❌</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">असफल लॉगिन</p>
              <p className="text-lg font-semibold text-gray-900">{securityStats.failedLogins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="IP, यूज़र या इवेंट खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी सेवेरिटी</option>
              {severityLevels.map((level) => (
                <option key={level.key} value={level.key}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी टाइप</option>
              {logTypes.map((type) => (
                <option key={type.key} value={type.key}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="last24hours">पिछले 24 घंटे</option>
              <option value="last7days">पिछले 7 दिन</option>
              <option value="last30days">पिछले 30 दिन</option>
              <option value="thismonth">इस महीने</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSeverity('all');
                setFilterType('all');
                setDateRange('last7days');
                setCurrentPage(1);
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              फिल्टर रीसेट करें
            </button>
          </div>
        </div>
      </div>

      {/* Security Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  टाइप
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  सेवेरिटी
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  मैसेज
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP एड्रेस
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  यूज़र
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  समय
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  कार्य
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getLogTypeIcon(log.type)}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {getLogTypeLabel(log.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getSeverityColor(log.severity)}-100 text-${getSeverityColor(log.severity)}-800`}>
                        {getSeverityLabel(log.severity)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {log.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.userName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {helpers.date.formatDate(log.createdAt, 'DD MMM YYYY, hh:mm A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          विवरण
                        </button>
                        {log.severity === 'critical' && !log.resolved && (
                          <button
                            onClick={() => handleResolveAlert(log.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            रिज़ॉल्व करें
                          </button>
                        )}
                        {log.ipAddress && (
                          <button
                            onClick={() => handleBlockIP(log.ipAddress)}
                            className="text-red-600 hover:text-red-900"
                          >
                            IP ब्लॉक करें
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                पेज {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  पिछला
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  अगला
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="सिक्योरिटी लॉग विवरण"
        size="large"
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">बेसिक जानकारी</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">टाइप:</span> {getLogTypeLabel(selectedLog.type)}</div>
                  <div><span className="font-medium">सेवेरिटी:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs bg-${getSeverityColor(selectedLog.severity)}-100 text-${getSeverityColor(selectedLog.severity)}-800`}>
                      {getSeverityLabel(selectedLog.severity)}
                    </span>
                  </div>
                  <div><span className="font-medium">समय:</span> {helpers.date.formatDate(selectedLog.createdAt, 'DD MMM YYYY, hh:mm:ss A')}</div>
                  <div><span className="font-medium">स्टेटस:</span> {selectedLog.resolved ? 'रिज़ॉल्व्ड' : 'पेंडिंग'}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">नेटवर्क जानकारी</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">IP एड्रेस:</span> {selectedLog.ipAddress}</div>
                  <div><span className="font-medium">यूज़र एजेंट:</span> {selectedLog.userAgent || 'N/A'}</div>
                  <div><span className="font-medium">रेफरर:</span> {selectedLog.referer || 'N/A'}</div>
                  <div><span className="font-medium">लोकेशन:</span> {selectedLog.location || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">मैसेज</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{selectedLog.message}</p>
              </div>
            </div>

            {selectedLog.details && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">अतिरिक्त विवरण</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {selectedLog.actions && selectedLog.actions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">किए गए कार्य</h3>
                <div className="space-y-2">
                  {selectedLog.actions.map((action, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{action.action}</p>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {helpers.date.formatDate(action.timestamp, 'DD MMM, hh:mm A')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityLogs;
