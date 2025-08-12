import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import ImageUploader from "../../components/ImageUploader";
import "../../App.css";

const VendorImages = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageDetails, setShowImageDetails] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'सभी छवियां', icon: '🖼️' },
    { id: 'products', name: 'उत्पाद छवियां', icon: '📦' },
    { id: 'banners', name: 'बैनर्स', icon: '🎨' },
    { id: 'logos', name: 'लोगो', icon: '🏷️' },
    { id: 'certificates', name: 'प्रमाणपत्र', icon: '🏆' },
    { id: 'gallery', name: 'गैलरी', icon: '📸' },
    { id: 'documents', name: 'दस्तावेज़', icon: '📄' }
  ];

  const sortOptions = [
    { id: 'recent', name: 'नवीनतम पहले' },
    { id: 'oldest', name: 'पुराने पहले' },
    { id: 'name-asc', name: 'नाम (अ-ज्ञ)' },
    { id: 'name-desc', name: 'नाम (ज्ञ-अ)' },
    { id: 'size-large', name: 'बड़ा साइज़ पहले' },
    { id: 'size-small', name: 'छोटा साइज़ पहले' },
    { id: 'used', name: 'इस्तेमाल किए गए' },
    { id: 'unused', name: 'अनुपयोगित' }
  ];

  useEffect(() => {
    loadImages();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterAndSortImages();
  }, [images, searchTerm, selectedCategory, sortBy]);

  const loadImages = async () => {
    try {
      const response = await axios.get('/vendor/images');
      if (response.data.success) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      // Mock data for demo
      setImages([
        {
          id: 1,
          name: 'कुंदन-हार-मुख्य.jpg',
          url: '/images/items/kundan-necklace.jpg',
          category: 'products',
          size: 2.4, // MB
          dimensions: { width: 1920, height: 1080 },
          uploadDate: '2024-01-15',
          usedIn: ['ORD-123', 'ORD-124'],
          tags: ['jewelry', 'kundan', 'necklace', 'traditional'],
          description: 'कुंदन हार की मुख्य छवि',
          isPublic: true,
          views: 245,
          downloads: 12
        },
        {
          id: 2,
          name: 'स्टोर-बैनर.jpg',
          url: '/images/banners/store-banner.jpg',
          category: 'banners',
          size: 1.8,
          dimensions: { width: 1200, height: 400 },
          uploadDate: '2024-01-10',
          usedIn: ['website-header'],
          tags: ['banner', 'store', 'header'],
          description: 'स्टोर का मुख्य बैनर',
          isPublic: true,
          views: 567,
          downloads: 23
        },
        {
          id: 3,
          name: 'BIS-प्रमाणपत्र.pdf',
          url: '/images/certificates/bis-certificate.pdf',
          category: 'certificates',
          size: 0.5,
          dimensions: { width: 595, height: 842 },
          uploadDate: '2024-01-05',
          usedIn: [],
          tags: ['certificate', 'bis', 'hallmark'],
          description: 'BIS हॉलमार्क प्रमाणपत्र',
          isPublic: false,
          views: 89,
          downloads: 5
        },
        {
          id: 4,
          name: 'चूड़ी-सेट-विविध.jpg',
          url: '/images/items/bangles.jpg',
          category: 'products',
          size: 3.2,
          dimensions: { width: 2048, height: 1536 },
          uploadDate: '2024-01-20',
          usedIn: ['ORD-125'],
          tags: ['bangles', 'set', 'variety', 'colorful'],
          description: 'विभिन्न रंगों की चूड़ियों का सेट',
          isPublic: true,
          views: 123,
          downloads: 8
        },
        {
          id: 5,
          name: 'लोगो-पारदर्शी.png',
          url: '/images/logos/logo-transparent.png',
          category: 'logos',
          size: 0.8,
          dimensions: { width: 512, height: 512 },
          uploadDate: '2024-01-01',
          usedIn: ['website', 'cards', 'letterhead'],
          tags: ['logo', 'transparent', 'brand'],
          description: 'स्टोर का पारदर्शी लोगो',
          isPublic: true,
          views: 345,
          downloads: 67
        }
      ]);
    }
  };

  const filterAndSortImages = () => {
    let filtered = images.filter(image => {
      const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort images
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'recent':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-large':
          return b.size - a.size;
        case 'size-small':
          return a.size - b.size;
        case 'used':
          return b.usedIn.length - a.usedIn.length;
        case 'unused':
          return a.usedIn.length - b.usedIn.length;
        default:
          return 0;
      }
    });

    setFilteredImages(filtered);
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => {
      return prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId];
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

	const handleBulkAction = async (action) => {
	if (selectedImages.length === 0) {
		console.warn('No images selected for bulk action');
		return;
	}

	try {
		switch (action) {
		case 'delete':
			if (window.confirm(`क्या आप वाकई ${selectedImages.length} छवियां हटाना चाहते हैं?`)) {
			await axios.delete('/vendor/images/bulk-delete', {
				data: { imageIds: selectedImages }
			});
			loadImages();
			setSelectedImages([]);
			console.log(`Successfully deleted ${selectedImages.length} images`);
			}
			break;
			
		case 'download':
			// Create zip and download
			console.log(`Starting download of ${selectedImages.length} images`);
			window.open(`/vendor/images/bulk-download?ids=${selectedImages.join(',')}`);
			break;
			
		case 'make-public':
			await axios.patch('/vendor/images/bulk-visibility', {
			imageIds: selectedImages,
			isPublic: true
			});
			loadImages();
			console.log(`Made ${selectedImages.length} images public`);
			break;
			
		case 'make-private':
			await axios.patch('/vendor/images/bulk-visibility', {
			imageIds: selectedImages,
			isPublic: false
			});
			loadImages();
			console.log(`Made ${selectedImages.length} images private`);
			break;
			
		default:
			console.warn(`Unknown bulk action: ${action}`);
			alert(`अज्ञात कार्य: ${action}. कृपया पुनः प्रयास करें।`);
			return;
		}
	} catch (error) {
		console.error('Bulk action failed:', error);
		
		// More specific error handling based on action
		const errorMessages = {
		delete: 'छवियां हटाने में त्रुटि',
		download: 'डाउनलोड करने में त्रुटि', 
		'make-public': 'छवियां पब्लिक करने में त्रुटि',
		'make-private': 'छवियां प्राइवेट करने में त्रुटि'
		};
		
		const errorMessage = errorMessages[action] || 'बल्क ऑपरेशन में त्रुटि';
		alert(`${errorMessage}. कृपया पुनः प्रयास करें।`);
		
		// Log additional error details for debugging
		console.error('Error details:', {
		action,
		selectedImagesCount: selectedImages.length,
		selectedImageIds: selectedImages,
		error: error.response?.data || error.message,
		timestamp: new Date().toISOString()
		});
	}
	};

  const handleImageUpload = async (newImages) => {
    setUploading(true);
    try {
      const formData = new FormData();
      newImages.forEach((image, index) => {
        formData.append(`images[${index}]`, image.file);
        formData.append(`names[${index}]`, image.name);
        formData.append(`categories[${index}]`, selectedCategory === 'all' ? 'products' : selectedCategory);
      });

      const response = await axios.post('/vendor/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        loadImages();
        setShowUploader(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const getImageStats = () => {
    const total = images.length;
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const used = images.filter(img => img.usedIn.length > 0).length;
    const unused = total - used;
    const publicImages = images.filter(img => img.isPublic).length;
    
    return { total, totalSize, used, unused, publicImages };
  };

  const stats = getImageStats();

  if (loading) {
    return <LoadingSpinner message="छवियां लोड हो रही हैं..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                  छवि प्रबंधन
                </h1>
                <p className="text-emerald-600 text-lg">
                  अपनी सभी छवियों को व्यवस्थित करें और प्रबंधित करें
                </p>
              </div>
              
              <button
                onClick={() => setShowUploader(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>📤</span>
                <span>नई छवि अपलोड करें</span>
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <VendorSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
                  <div className="text-center">
                    <p className="text-blue-100 text-sm font-medium">कुल छवियां</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                  <div className="text-center">
                    <p className="text-green-100 text-sm font-medium">उपयोग में</p>
                    <p className="text-2xl font-bold">{stats.used}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-4 text-white">
                  <div className="text-center">
                    <p className="text-yellow-100 text-sm font-medium">अनुपयोगित</p>
                    <p className="text-2xl font-bold">{stats.unused}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
                  <div className="text-center">
                    <p className="text-purple-100 text-sm font-medium">पब्लिक</p>
                    <p className="text-2xl font-bold">{stats.publicImages}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-4 text-white">
                  <div className="text-center">
                    <p className="text-red-100 text-sm font-medium">कुल साइज़</p>
                    <p className="text-xl font-bold">{stats.totalSize.toFixed(1)} MB</p>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="छवि खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">श्रेणी</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">क्रमबद्ध करें</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">व्यू मोड</label>
                    <div className="flex bg-emerald-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === 'grid' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        ⊞ ग्रिड
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === 'list' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        ☰ लिस्ट
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedImages.length > 0 && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-800 font-medium">
                        {selectedImages.length} छवियां चयनित
                      </span>
                      <button
                        onClick={() => setSelectedImages([])}
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        चयन हटाएं
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkAction('download')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                      >
                        डाउनलोड
                      </button>
                      <button
                        onClick={() => handleBulkAction('make-public')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                      >
                        पब्लिक करें
                      </button>
                      <button
                        onClick={() => handleBulkAction('make-private')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm"
                      >
                        प्राइवेट करें
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                )}

                {/* Select All */}
                <div className="flex items-center justify-between">
                  <div className="text-emerald-600 font-medium">
                    {filteredImages.length} छवियां मिलीं
                  </div>
                  {filteredImages.length > 0 && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedImages.length === filteredImages.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span className="text-emerald-700 text-sm">सभी चुनें</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Images Grid/List */}
              {filteredImages.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                        selectedImages.includes(image.id) ? 'ring-2 ring-emerald-500' : ''
                      } ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      {/* Image Preview */}
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-24' : 'h-48'} overflow-hidden`}>
                        {image.url.endsWith('.pdf') ? (
                          <div className="w-full h-full bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 text-4xl">📄</span>
                          </div>
                        ) : (
                          <img 
                            src={image.url} 
                            alt={image.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        
                        {/* Selection Checkbox */}
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.id)}
                            onChange={() => handleImageSelect(image.id)}
                            className="w-5 h-5 text-emerald-600 bg-white rounded border-2 border-emerald-300"
                          />
                        </div>

                        {/* Visibility Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            image.isPublic 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {image.isPublic ? '🌐' : '🔒'}
                          </span>
                        </div>

                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedImage(image);
                                setShowImageDetails(true);
                              }}
                              className="bg-white text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors duration-200"
                              title="विस्तार देखें"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => window.open(image.url, '_blank')}
                              className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                              title="डाउनलोड करें"
                            >
                              ⬇️
                            </button>
                            <button
                              onClick={() => navigator.clipboard.writeText(image.url)}
                              className="bg-white text-purple-600 p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                              title="लिंक कॉपी करें"
                            >
                              🔗
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-semibold text-emerald-800 mb-2 line-clamp-2">
                          {image.name}
                        </h3>
                        
                        {viewMode === 'list' && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {image.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                            {categories.find(c => c.id === image.category)?.name}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {image.size.toFixed(1)} MB
                          </span>
                        </div>

                        <div className="text-gray-600 text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span>📅 {new Date(image.uploadDate).toLocaleDateString('hi-IN')}</span>
                            <span>👁️ {image.views}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>📐 {image.dimensions.width}×{image.dimensions.height}</span>
                            <span>📦 {image.usedIn.length} में उपयोग</span>
                          </div>
                        </div>

                        {viewMode === 'grid' && image.tags.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {image.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  #{tag}
                                </span>
                              ))}
                              {image.tags.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  +{image.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Images */
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🖼️</div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">कोई छवि नहीं मिली</h3>
                  <p className="text-emerald-600 mb-6">
                    {images.length === 0 
                      ? 'अभी तक कोई छवि अपलोड नहीं की गई है।' 
                      : 'आपके फ़िल्टर के अनुसार कोई छवि नहीं मिली।'
                    }
                  </p>
                  <button
                    onClick={() => setShowUploader(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    पहली छवि अपलोड करें
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Uploader Modal */}
        {showUploader && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">नई छवि अपलोड करें</h2>
                <button
                  onClick={() => setShowUploader(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
              
              <ImageUploader
                images={[]}
                onImagesChange={handleImageUpload}
                maxImages={10}
                disabled={uploading}
              />
              
              {uploading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-emerald-600">
                    <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <span>अपलोड हो रहा है...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Details Modal */}
        {showImageDetails && selectedImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-emerald-800">छवि विवरण</h2>
                <button
                  onClick={() => setShowImageDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Preview */}
                <div>
                  {selectedImage.url.endsWith('.pdf') ? (
                    <div className="w-full h-64 bg-red-100 flex items-center justify-center rounded-xl">
                      <span className="text-red-600 text-6xl">📄</span>
                    </div>
                  ) : (
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.name}
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  )}
                </div>

                {/* Image Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-1">फ़ाइल का नाम</h3>
                    <p className="text-gray-700">{selectedImage.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-1">विवरण</h3>
                    <p className="text-gray-700">{selectedImage.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-1">साइज़</h3>
                      <p className="text-gray-700">{selectedImage.size.toFixed(1)} MB</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-1">आयाम</h3>
                      <p className="text-gray-700">{selectedImage.dimensions.width}×{selectedImage.dimensions.height}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-1">टैग्स</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-1">उपयोग में</h3>
                    <div className="space-y-1">
                      {selectedImage.usedIn.length > 0 ? (
                        selectedImage.usedIn.map((usage, index) => (
                          <span key={index} className="block bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                            {usage}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">कहीं उपयोग नहीं हुई</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => window.open(selectedImage.url, '_blank')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      डाउनलोड करें
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedImage.url)}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
                    >
                      लिंक कॉपी करें
                    </button>
                    <button
                      onClick={() => {
                        // Delete image logic
                        setShowImageDetails(false);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      हटाएं
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.StrictMode>
  );
};

export default VendorImages;