import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAPI } from '../hooks/useAPI';
import { useDebounce } from '../hooks/useDebounce';
import { useNotification } from '../hooks/useNotification';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { get } = useAPI();
  const { showError } = useNotification();
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: {
      min: parseInt(searchParams.get('price_min')) || 0,
      max: parseInt(searchParams.get('price_max')) || 100000
    },
    rating: parseInt(searchParams.get('rating')) || 0,
    inStock: searchParams.get('in_stock') === 'true',
    discount: parseInt(searchParams.get('discount')) || 0,
    seller: searchParams.get('seller') || '',
    location: searchParams.get('location') || ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [relatedSearches, setRelatedSearches] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const sortOptions = [
    { id: 'relevance', name: 'प्रासंगिकता', icon: '🎯' },
    { id: 'price_low', name: 'कम कीमत पहले', icon: '💰' },
    { id: 'price_high', name: 'ज्यादा कीमत पहले', icon: '💎' },
    { id: 'rating', name: 'रेटिंग के अनुसार', icon: '⭐' },
    { id: 'newest', name: 'नए पहले', icon: '🆕' },
    { id: 'discount', name: 'ज्यादा छूट', icon: '🏷️' },
    { id: 'popularity', name: 'लोकप्रियता', icon: '🔥' }
  ];

  const resultsPerPage = 20;

  useEffect(() => {
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery) {
      performSearch();
      updateURL();
    }
  }, [debouncedSearchQuery, currentPage, sortBy, filters]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const loadSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('bharatshaala_search_history') || '[]');
    setSearchHistory(history.slice(0, 10)); // Last 10 searches
  };

  const saveToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    const history = JSON.parse(localStorage.getItem('bharatshaala_search_history') || '[]');
    const filtered = history.filter(item => item.query !== query);
    const updated = [{ query, timestamp: new Date().toISOString() }, ...filtered].slice(0, 10);
    
    localStorage.setItem('bharatshaala_search_history', JSON.stringify(updated));
    setSearchHistory(updated);
  };

  const performSearch = async () => {
    if (!debouncedSearchQuery.trim()) {
      setResults([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const searchFilters = {
        q: debouncedSearchQuery,
        page: currentPage,
        limit: resultsPerPage,
        sort: sortBy,
        ...filters
      };

      const response = await get('/search', { params: searchFilters });
      
      if (response.success) {
        setResults(response.results);
        setTotalResults(response.totalResults);
        setSuggestions(response.suggestions || []);
        setRelatedSearches(response.relatedSearches || []);
        saveToSearchHistory(debouncedSearchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Mock search results for demo
      const mockResults = generateMockSearchResults(debouncedSearchQuery);
      setResults(mockResults);
      setTotalResults(mockResults.length);
      setSuggestions([
        `${debouncedSearchQuery} set`,
        `${debouncedSearchQuery} collection`,
        `handmade ${debouncedSearchQuery}`,
        `traditional ${debouncedSearchQuery}`,
        `${debouncedSearchQuery} for women`
      ]);
      setRelatedSearches([
        'राजस्थानी ज्वेलरी',
        'हैंडमेड आभूषण',
        'ट्रेडिशनल नेकलेस',
        'कुंदन सेट',
        'पर्ल ज्वेलरी'
      ]);
      saveToSearchHistory(debouncedSearchQuery);
    }
    setLoading(false);
  };

  const generateMockSearchResults = (query) => {
    const baseProducts = [
      {
        id: 1,
        name: 'कुंदन पर्ल नेकलेस सेट',
        nameEn: 'Kundan Pearl Necklace Set',
        image: '/images/items/kundan-necklace-1.jpg',
        price: 15999,
        originalPrice: 19999,
        discount: 20,
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        seller: 'राजस्थानी जेम्स',
        category: 'jewelry',
        tags: ['कुंदन', 'पर्ल', 'नेकलेस', 'traditional']
      },
      {
        id: 2,
        name: 'राजस्थानी चूड़ी सेट',
        nameEn: 'Rajasthani Bangle Set',
        image: '/images/items/bangles.jpg',
        price: 2999,
        originalPrice: 3499,
        discount: 14,
        rating: 4.3,
        reviewCount: 156,
        inStock: true,
        seller: 'जयपुर हैंडीक्राफ्ट्स',
        category: 'jewelry',
        tags: ['चूड़ी', 'bangles', 'colorful', 'traditional']
      },
      {
        id: 3,
        name: 'हस्तनिर्मित पश्मीना शॉल',
        nameEn: 'Handwoven Pashmina Shawl',
        image: '/images/items/shawl.jpg',
        price: 8999,
        originalPrice: 8999,
        discount: 0,
        rating: 4.8,
        reviewCount: 67,
        inStock: true,
        seller: 'कश्मीर आर्ट्स',
        category: 'textiles',
        tags: ['पश्मीना', 'shawl', 'handwoven', 'kashmiri']
      }
    ];

    // Filter results based on query
    return baseProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      product.seller.toLowerCase().includes(query.toLowerCase())
    );
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (filters.category) params.set('category', filters.category);
    if (filters.priceRange.min > 0) params.set('price_min', filters.priceRange.min.toString());
    if (filters.priceRange.max < 100000) params.set('price_max', filters.priceRange.max.toString());
    if (filters.rating > 0) params.set('rating', filters.rating.toString());
    if (filters.inStock) params.set('in_stock', 'true');
    if (filters.discount > 0) params.set('discount', filters.discount.toString());
    if (filters.seller) params.set('seller', filters.seller);
    if (filters.location) params.set('location', filters.location);

    setSearchParams(params);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: 0, max: 100000 },
      rating: 0,
      inStock: false,
      discount: 0,
      seller: '',
      location: ''
    });
    setCurrentPage(1);
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    return result;
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="उत्पाद, ब्रांड या श्रेणी खोजें..."
                className="w-full px-6 py-4 pl-12 pr-20 text-lg border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && searchQuery && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2">सुझाव:</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm hover:bg-emerald-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && !searchQuery && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-emerald-800 mb-2">हाल की खोजें:</h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item.query)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <span>🕒</span>
                      <span>{item.query}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Summary */}
            {searchQuery && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-800">
                    <span className="font-bold">{totalResults.toLocaleString()}</span> परिणाम मिले 
                    <span className="font-semibold"> "{searchQuery}"</span> के लिए
                  </p>
                  {loading && <p className="text-emerald-600 text-sm">खोज रही है...</p>}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-emerald-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-emerald-600 hover:bg-emerald-200'
                      }`}
                    >
                      ⊞
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-emerald-600 hover:bg-emerald-200'
                      }`}
                    >
                      ☰
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      showFilters ? 'bg-emerald-500 text-white' : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <span>🔧</span>
                    <span>फ़िल्टर</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {searchQuery ? (
          <div className="flex gap-8">
            
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-80">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={clearFilters}
                />
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              {loading ? (
                <LoadingSpinner message="खोज रही है..." />
              ) : results.length > 0 ? (
                <>
                  {/* Results Grid */}
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8' 
                    : 'space-y-4 mb-8'
                  }>
                    {results.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        viewMode={viewMode}
                        className={viewMode === 'list' ? 'flex' : ''}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        पिछला
                      </button>

                      {generatePagination().map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-emerald-500 text-white'
                              : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-emerald-200 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        अगला
                      </button>
                    </div>
                  )}

                  {/* Related Searches */}
                  {relatedSearches.length > 0 && (
                    <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-emerald-800 mb-4">संबंधित खोजें</h3>
                      <div className="flex flex-wrap gap-3">
                        {relatedSearches.map((relatedQuery, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(relatedQuery)}
                            className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                          >
                            {relatedQuery}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No Results */
                <div className="text-center py-20">
                  <div className="text-8xl mb-6">🔍</div>
                  <h2 className="text-3xl font-bold text-emerald-800 mb-4">
                    कोई परिणाम नहीं मिला
                  </h2>
                  <p className="text-emerald-600 text-lg mb-8">
                    "{searchQuery}" के लिए कोई उत्पाद नहीं मिला
                  </p>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">खोज सुझाव:</h3>
                      <ul className="text-blue-700 text-sm space-y-1 text-left">
                        <li>• वर्तनी की जांच करें</li>
                        <li>• अधिक सामान्य शब्दों का उपयोग करें</li>
                        <li>• कम शब्दों का उपयोग करें</li>
                        <li>• फ़िल्टर हटाकर देखें</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => navigate('/markets')}
                      className="bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      सभी बाज़ार देखें
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">
              कुछ खोजें
            </h2>
            <p className="text-emerald-600 text-lg mb-8">
              लाखों उत्पादों में से अपनी पसंद का सामान खोजें
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['jewelry', 'clothing', 'handicrafts', 'books'].map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleSearch(category)}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-3xl mb-2">
                      {category === 'jewelry' ? '💎' :
                       category === 'clothing' ? '👗' :
                       category === 'handicrafts' ? '🎨' : '📚'}
                    </div>
                    <p className="text-emerald-800 font-medium">
                      {category === 'jewelry' ? 'आभूषण' :
                       category === 'clothing' ? 'कपड़े' :
                       category === 'handicrafts' ? 'हस्तशिल्प' : 'किताबें'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;