// Customer Support Component - Bharatshala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const CustomerSupport = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    attachments: []
  });

  const [newMessage, setNewMessage] = useState('');

  const ticketCategories = [
    { value: 'order', label: 'ऑर्डर संबंधी', icon: '📦' },
    { value: 'payment', label: 'पेमेंट', icon: '💳' },
    { value: 'delivery', label: 'डिलीवरी', icon: '🚚' },
    { value: 'product', label: 'प्रोडक्ट क्वालिटी', icon: '📱' },
    { value: 'return', label: 'रिटर्न/रिफंड', icon: '↩️' },
    { value: 'account', label: 'अकाउंट', icon: '👤' },
    { value: 'technical', label: 'तकनीकी', icon: '🔧' },
    { value: 'other', label: 'अन्य', icon: '❓' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'कम', color: 'green' },
    { value: 'medium', label: 'मध्यम', color: 'yellow' },
    { value: 'high', label: 'उच्च', color: 'orange' },
    { value: 'urgent', label: 'अत्यावश्यक', color: 'red' }
  ];

  const statusColors = {
    open: 'blue',
    in_progress: 'yellow',
    resolved: 'green',
    closed: 'gray'
  };

  const statusLabels = {
    open: 'खुला',
    in_progress: 'प्रगति में',
    resolved: 'हल हो गया',
    closed: 'बंद'
  };

  useEffect(() => {
    trackPageView('customer_support');
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSupportTickets();
      if (response.success) {
        setTickets(response.data);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiService.createSupportTicket(ticketForm);
      if (response.success) {
        await loadTickets();
        setShowCreateTicket(false);
        setTicketForm({
          subject: '',
          category: '',
          priority: 'medium',
          description: '',
          attachments: []
        });
        trackEvent('support_ticket_created', {
          category: ticketForm.category,
          priority: ticketForm.priority
        });
        alert('टिकट सफलतापूर्वक बनाया गया!');
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('टिकट बनाने में समस्या हुई');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const response = await apiService.updateSupportTicket(selectedTicket.id, {
        action: 'add_message',
        message: newMessage.trim()
      });

      if (response.success) {
        setSelectedTicket(response.data);
        setNewMessage('');
        await loadTickets();
        trackEvent('support_message_sent', {
          ticketId: selectedTicket.id
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('मैसेज भेजने में समस्या हुई');
    }
  };

  const handleCloseTicket = async (ticketId) => {
    if (window.confirm('क्या आप इस टिकट को बंद करना चाहते हैं?')) {
      try {
        const response = await apiService.updateSupportTicket(ticketId, {
          action: 'close'
        });

        if (response.success) {
          await loadTickets();
          setSelectedTicket(null);
          trackEvent('support_ticket_closed', { ticketId });
          alert('टिकट बंद कर दिया गया');
        }
      } catch (error) {
        console.error('Failed to close ticket:', error);
        alert('टिकट बंद करने में समस्या हुई');
      }
    }
  };

  const getPriorityColor = (priority) => {
    const level = priorityLevels.find(p => p.value === priority);
    return level ? level.color : 'gray';
  };

  const getCategoryIcon = (category) => {
    const cat = ticketCategories.find(c => c.value === category);
    return cat ? cat.icon : '❓';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="सपोर्ट टिकट्स लोड हो रहे हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>कस्टमर सपोर्ट - भारतशाला | Customer Support</title>
        <meta name="description" content="अपने सपोर्ट टिकट्स देखें और नए टिकट बनाएं। हमारी टीम आपकी समस्याओं का समाधान करने के लिए तैयार है।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">कस्टमर सपोर्ट</h1>
                <p className="text-gray-600">अपने सपोर्ट टिकट्स और मैसेजेस मैनेज करें</p>
              </div>
              <button
                onClick={() => setShowCreateTicket(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                + नया टिकट बनाएं
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">मेरे टिकट्स</h2>
                
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎫</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">कोई टिकट नहीं मिला</h3>
                    <p className="text-gray-600 mb-4">अभी तक कोई सपोर्ट टिकट नहीं बनाया गया</p>
                    <button
                      onClick={() => setShowCreateTicket(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      पहला टिकट बनाएं
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedTicket?.id === ticket.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                            <span className="font-semibold text-gray-900">#{ticket.id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(ticket.priority)}-100 text-${getPriorityColor(ticket.priority)}-800`}>
                              {priorityLevels.find(p => p.value === ticket.priority)?.label}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColors[ticket.status]}-100 text-${statusColors[ticket.status]}-800`}>
                              {statusLabels[ticket.status]}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{new Date(ticket.createdAt).toLocaleDateString('hi-IN')}</span>
                          {ticket.lastMessageAt && (
                            <span>अंतिम मैसेज: {new Date(ticket.lastMessageAt).toLocaleDateString('hi-IN')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Details / Create Form */}
            <div className="lg:col-span-2">
              {showCreateTicket ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">नया सपोर्ट टिकट</h2>
                    <button
                      onClick={() => setShowCreateTicket(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        विषय *
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="समस्या का संक्षिप्त विवरण"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          श्रेणी *
                        </label>
                        <select
                          required
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">श्रेणी चुनें</option>
                          {ticketCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.icon} {category.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          प्राथमिकता
                        </label>
                        <select
                          value={ticketForm.priority}
                          onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {priorityLevels.map((priority) => (
                            <option key={priority.value} value={priority.value}>
                              {priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        विवरण *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="अपनी समस्या का विस्तृत विवरण दें..."
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        टिकट बनाएं
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateTicket(false)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                      >
                        रद्द करें
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : selectedTicket ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  {/* Ticket Header */}
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(selectedTicket.category)}</span>
                          <h2 className="text-xl font-bold text-gray-900">#{selectedTicket.id}</h2>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${statusColors[selectedTicket.status]}-100 text-${statusColors[selectedTicket.status]}-800`}>
                            {statusLabels[selectedTicket.status]}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTicket.subject}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>श्रेणी: {ticketCategories.find(c => c.value === selectedTicket.category)?.label}</span>
                          <span>प्राथमिकता: {priorityLevels.find(p => p.value === selectedTicket.priority)?.label}</span>
                          <span>बनाया गया: {new Date(selectedTicket.createdAt).toLocaleDateString('hi-IN')}</span>
                        </div>
                      </div>
                      
                      {selectedTicket.status !== 'closed' && (
                        <button
                          onClick={() => handleCloseTicket(selectedTicket.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          टिकट बंद करें
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">बातचीत</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {/* Initial ticket message */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-blue-900">आप</span>
                          <span className="text-sm text-blue-600">{new Date(selectedTicket.createdAt).toLocaleString('hi-IN')}</span>
                        </div>
                        <p className="text-blue-800">{selectedTicket.description}</p>
                      </div>

                      {/* Conversation messages */}
                      {selectedTicket.messages?.map((message, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-4 ${
                            message.sender === 'user'
                              ? 'bg-blue-50 ml-8'
                              : 'bg-gray-50 mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold ${
                              message.sender === 'user' ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {message.sender === 'user' ? 'आप' : 'सपोर्ट टीम'}
                            </span>
                            <span className={`text-sm ${
                              message.sender === 'user' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {new Date(message.timestamp).toLocaleString('hi-IN')}
                            </span>
                          </div>
                          <p className={message.sender === 'user' ? 'text-blue-800' : 'text-gray-800'}>
                            {message.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Form */}
                  {selectedTicket.status !== 'closed' && (
                    <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          जवाब भेजें
                        </label>
                        <textarea
                          rows={3}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="अपना संदेश लिखें..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        संदेश भेजें
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">टिकट चुनें</h3>
                  <p className="text-gray-600 mb-4">
                    विवरण देखने के लिए बाईं ओर से कोई टिकट चुनें या नया टिकट बनाएं
                  </p>
                  <button
                    onClick={() => setShowCreateTicket(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    नया टिकट बनाएं
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerSupport;