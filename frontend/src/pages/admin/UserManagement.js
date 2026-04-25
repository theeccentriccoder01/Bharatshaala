import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get, put, delete: deleteUser, post } = useAPI();
  const { showSuccess, showError, showInfo } = useNotification();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const usersPerPage = 20;

  const statusOptions = [
    { id: 'all', name: 'सभी स्टेटस', count: 0 },
    { id: 'active', name: 'सक्रिय', count: 0 },
    { id: 'inactive', name: 'निष्क्रिय', count: 0 },
    { id: 'suspended', name: 'निलंबित', count: 0 },
    { id: 'banned', name: 'प्रतिबंधित', count: 0 }
  ];

  const roleOptions = [
    { id: 'all', name: 'सभी भूमिकाएं' },
    { id: 'user', name: 'ग्राहक' },
    { id: 'vendor', name: 'विक्रेता' },
    { id: 'admin', name: 'एडमिन' },
    { id: 'moderator', name: 'मॉडरेटर' }
  ];

  const sortOptions = [
    { id: 'created_desc', name: 'नवीनतम पहले' },
    { id: 'created_asc', name: 'पुराने पहले' },
    { id: 'name_asc', name: 'नाम (अ-ज्ञ)' },
    { id: 'name_desc', name: 'नाम (ज्ञ-अ)' },
    { id: 'orders_desc', name: 'ज्यादा ऑर्डर्स' },
    { id: 'last_active', name: 'हाल की गतिविधि' }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadUsers();
  }, [isAuthenticated, user, currentPage, sortBy]);

  useEffect(() => {
    filterAndSearchUsers();
  }, [users, searchTerm, filterStatus, filterRole, sortBy]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await get('/admin/users', {
        params: {
          page: currentPage,
          limit: usersPerPage,
          sort: sortBy
        }
      });
      
      if (response.success) {
        setUsers(response.users);
        setTotalUsers(response.totalUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Mock data for demo
      const mockUsers = [
        {
          id: 1,
          name: 'राम शर्मा',
          email: 'ram.sharma@email.com',
          phone: '+91 9876543210',
          role: 'user',
          status: 'active',
          avatar: '/images/avatars/customer5.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          lastActive: '2025-08-04T05:45:00Z',
          orders: 23,
          totalSpent: 145000,
          city: 'दिल्ली',
          verified: true,
          riskScore: 'low',
          notes: 'नियमित ग्राहक, अच्छी रेटिंग'
        },
        {
          id: 2,
          name: 'प्रिया गुप्ता',
          email: 'priya.gupta@email.com',
          phone: '+91 9876543211',
          role: 'user',
          status: 'active',
          avatar: '/images/avatars/customer1.jpg',
          createdAt: '2024-02-20T14:15:00Z',
          lastActive: '2025-08-04T04:30:00Z',
          orders: 67,
          totalSpent: 289000,
          city: 'मुंबई',
          verified: true,
          riskScore: 'low',
          notes: 'प्रीमियम ग्राहक'
        },
        {
          id: 3,
          name: 'अनिल कुमार',
          email: 'anil.kumar@email.com',
          phone: '+91 9876543212',
          role: 'vendor',
          status: 'active',
          avatar: '/images/avatars/vendor1.jpg',
          createdAt: '2024-01-10T09:00:00Z',
          lastActive: '2025-08-04T06:00:00Z',
          orders: 0,
          totalSpent: 0,
          city: 'जयपुर',
          verified: true,
          riskScore: 'low',
          notes: 'सत्यापित विक्रेता'
        },
        {
          id: 4,
          name: 'सुनीता देवी',
          email: 'sunita.devi@email.com',
          phone: '+91 9876543213',
          role: 'user',
          status: 'suspended',
          avatar: '/images/avatars/customer2.jpg',
          createdAt: '2024-03-05T11:20:00Z',
          lastActive: '2025-08-01T08:15:00Z',
          orders: 3,
          totalSpent: 12000,
          city: 'कोलकाता',
          verified: false,
          riskScore: 'medium',
          notes: 'असामान्य गतिविधि के कारण निलंबित'
        },
        {
          id: 5,
          name: 'विकास सिंह',
          email: 'vikas.singh@email.com',
          phone: '+91 9876543214',
          role: 'user',
          status: 'banned',
          avatar: '/images/avatars/customer6.jpg',
          createdAt: '2024-04-12T16:45:00Z',
          lastActive: '2025-07-28T12:30:00Z',
          orders: 1,
          totalSpent: 5000,
          city: 'चेन्नई',
          verified: false,
          riskScore: 'high',
          notes: 'फर्जी रिव्यू के कारण प्रतिबंधित'
        }
      ];
      setUsers(mockUsers);
      setTotalUsers(mockUsers.length);
    }
    setLoading(false);
  };

  const filterAndSearchUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Update status counts
    statusOptions[0].count = users.length;
    statusOptions[1].count = users.filter(u => u.status === 'active').length;
    statusOptions[2].count = users.filter(u => u.status === 'inactive').length;
    statusOptions[3].count = users.filter(u => u.status === 'suspended').length;
    statusOptions[4].count = users.filter(u => u.status === 'banned').length;

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      let response;
      switch (action) {
        case 'activate':
          response = await put(`/admin/users/${userId}/status`, { status: 'active' });
          break;
        case 'suspend':
          response = await put(`/admin/users/${userId}/status`, { status: 'suspended' });
          break;
        case 'ban':
          response = await put(`/admin/users/${userId}/status`, { status: 'banned' });
          break;
        case 'delete':
          if (window.confirm('क्या आप वाकई इस यूज़र को डिलीट करना चाहते हैं?')) {
            response = await deleteUser(`/admin/users/${userId}`);
          } else {
            return;
          }
          break;
        default:
          showError(`अज्ञात कार्य: ${action}`);
          return;
      }

      if (response.success) {
        showSuccess('यूज़र स्टेटस अपडेट हो गया');
        loadUsers();
      }
    } catch (error) {
      showError('कार्य करने में त्रुटि');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      showInfo('कृपया पहले कुछ यूज़र चुनें');
      return;
    }

    if (!window.confirm(`क्या आप ${selectedUsers.length} यूज़र्स पर यह कार्य करना चाहते हैं?`)) {
      return;
    }

    try {
      const response = await post('/admin/users/bulk-action', {
        userIds: selectedUsers,
        action: action
      });

      if (response.success) {
        showSuccess('बल्क एक्शन सफल');
        setSelectedUsers([]);
        loadUsers();
      }
    } catch (error) {
      showError('बल्क एक्शन में त्रुटि');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const showUserDetailsModal = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'सक्रिय' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'निष्क्रिय' },
      suspended: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'निलंबित' },
      banned: { bg: 'bg-red-100', text: 'text-red-800', label: 'प्रतिबंधित' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRiskBadge = (riskScore) => {
    const riskConfig = {
      low: { bg: 'bg-green-100', text: 'text-green-800', label: 'कम जोखिम' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'मध्यम जोखिम' },
      high: { bg: 'bg-red-100', text: 'text-red-800', label: 'उच्च जोखिम' }
    };
    
    const config = riskConfig[riskScore] || riskConfig.low;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  if (loading) {
    return <LoadingSpinner message="यूज़र डेटा लोड हो रहा है..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                यूज़र प्रबंधन 👥
              </h1>
              <p className="text-slate-600 text-lg">
                कुल {totalUsers.toLocaleString()} यूज़र्स प्रबंधित करें
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

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-slate-800 font-semibold mb-2">खोजें</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="नाम, ईमेल, फोन या शहर खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">स्टेटस</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none"
              >
                {statusOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name} ({option.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">भूमिका</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none"
              >
                {roleOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort and Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <span className="text-sm">सभी चुनें ({selectedUsers.length})</span>
              </label>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  सक्रिय करें
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm"
                >
                  निलंबित करें
                </button>
                <button
                  onClick={() => handleBulkAction('ban')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                >
                  प्रतिबंधित करें
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    यूज़र
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    संपर्क
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    भूमिका/स्थिति
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    गतिविधि
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    जोखिम
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    कार्य
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500 mr-4"
                        />
                        <div className="flex items-center">
                          <img
                            src={user.avatar || '/images/default-avatar.jpg'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                              <span>{user.name}</span>
                              {user.verified && <span className="text-green-500">✓</span>}
                            </div>
                            <div className="text-sm text-slate-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.email}</div>
                      <div className="text-sm text-slate-500">{user.phone}</div>
                      <div className="text-sm text-slate-500">{user.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {user.role === 'user' ? 'ग्राहक' :
                           user.role === 'vendor' ? 'विक्रेता' :
                           user.role === 'admin' ? 'एडमिन' : user.role}
                        </span>
                        {getStatusBadge(user.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div>ऑर्डर्स: {user.orders}</div>
                      <div>खर्च: ₹{user.totalSpent.toLocaleString()}</div>
                      <div className="text-slate-500">
                        अंतिम: {formatDate(user.lastActive)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRiskBadge(user.riskScore)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => showUserDetailsModal(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="विवरण देखें"
                        >
                          👁️
                        </button>
                        
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="निलंबित करें"
                          >
                            ⏸️
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-green-600 hover:text-green-900"
                            title="सक्रिय करें"
                          >
                            ▶️
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="text-red-600 hover:text-red-900"
                          title="प्रतिबंधित करें"
                        >
                          🚫
                        </button>
                        
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="डिलीट करें"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                कुल {totalUsers} में से {((currentPage - 1) * usersPerPage) + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} दिखा रहे हैं
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  पिछला
                </button>
                <span className="px-4 py-2 bg-slate-500 text-white rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  अगला
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">यूज़र विवरण</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar || '/images/default-avatar.jpg'}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                      <span>{selectedUser.name}</span>
                      {selectedUser.verified && <span className="text-green-500">✓</span>}
                    </h3>
                    <p className="text-slate-600">{selectedUser.email}</p>
                    <p className="text-slate-600">{selectedUser.phone}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusBadge(selectedUser.status)}
                      {getRiskBadge(selectedUser.riskScore)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800">कुल ऑर्डर्स</h4>
                    <p className="text-2xl font-bold text-slate-600">{selectedUser.orders}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-800">कुल खर्च</h4>
                    <p className="text-2xl font-bold text-slate-600">₹{selectedUser.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">रजिस्ट्रेशन</h4>
                    <p className="text-slate-600">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">अंतिम गतिविधि</h4>
                    <p className="text-slate-600">{formatDate(selectedUser.lastActive)}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedUser.notes && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">नोट्स</h4>
                    <p className="text-slate-600 bg-slate-50 rounded-xl p-4">{selectedUser.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    बंद करें
                  </button>
                  <button
                    onClick={() => {
                      // Navigate to user's detailed page
                      navigate(`/admin/users/${selectedUser.id}`);
                    }}
                    className="bg-slate-500 text-white px-6 py-2 rounded-lg hover:bg-slate-600"
                  >
                    पूरा विवरण देखें
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
