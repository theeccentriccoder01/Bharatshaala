import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const FilterPanel = ({
  filters = {},
  onFiltersChange,
  categories = [],
  priceRange = { min: 0, max: 100000 },
  brands = [],
  ratings = [1, 2, 3, 4, 5],
  isOpen = true,
  onToggle,
  clearAllFilters,
  className = ''
}) => {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    subCategory: '',
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    brands: [],
    rating: 0,
    inStock: false,
    onSale: false,
    handmade: false,
    newArrivals: false,
    sortBy: 'popular',
    ...filters
  });

  const debouncedFilters = useDebounce(localFilters, 300);

  useEffect(() => {
    onFiltersChange?.(debouncedFilters);
  }, [debouncedFilters, onFiltersChange]);

  const updateFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleArrayFilter = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const resetFilters = () => {
    setLocalFilters({
      category: '',
      subCategory: '',
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      brands: [],
      rating: 0,
      inStock: false,
      onSale: false,
      handmade: false,
      newArrivals: false,
      sortBy: 'popular'
    });
    clearAllFilters?.();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category) count++;
    if (localFilters.subCategory) count++;
    if (localFilters.priceMin > priceRange.min || localFilters.priceMax < priceRange.max) count++;
    if (localFilters.brands.length > 0) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.inStock) count++;
    if (localFilters.onSale) count++;
    if (localFilters.handmade) count++;
    if (localFilters.newArrivals) count++;
    return count;
  };

  const subcategories = categories.find(cat => cat.id === localFilters.category)?.subcategories || [];

  return (
    <div className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-200 dark:border-emerald-700 ${className}`}>
      
      {/* Header */}
      <div className="p-6 border-b border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">फ़िल्टर</h3>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={resetFilters}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm underline"
              >
                सभी साफ़ करें
              </button>
            )}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg"
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          
          {/* Sort By */}
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">क्रमबद्ध करें</h4>
            <select
              value={localFilters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full px-3 py-2 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              <option value="popular">लोकप्रिय</option>
              <option value="newest">नवीनतम</option>
              <option value="price-low">कम कीमत पहले</option>
              <option value="price-high">अधिक कीमत पहले</option>
              <option value="rating">रेटिंग के अनुसार</option>
              <option value="name">नाम के अनुसार</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">श्रेणी</h4>
            <div className="space-y-2">
              <select
                value={localFilters.category}
                onChange={(e) => {
                  updateFilter('category', e.target.value);
                  updateFilter('subCategory', ''); // Reset subcategory
                }}
                className="w-full px-3 py-2 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="">सभी श्रेणियां</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {subcategories.length > 0 && (
                <select
                  value={localFilters.subCategory}
                  onChange={(e) => updateFilter('subCategory', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">सभी उप-श्रेणियां</option>
                  {subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
              मूल्य सीमा: ₹{localFilters.priceMin.toLocaleString()} - ₹{localFilters.priceMax.toLocaleString()}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-emerald-600 dark:text-emerald-400">न्यूनतम मूल्य</label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localFilters.priceMin}
                  onChange={(e) => updateFilter('priceMin', parseInt(e.target.value))}
                  className="w-full mt-1 accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-emerald-600 dark:text-emerald-400">अधिकतम मूल्य</label>
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={localFilters.priceMax}
                  onChange={(e) => updateFilter('priceMax', parseInt(e.target.value))}
                  className="w-full mt-1 accent-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="न्यूनतम"
                  value={localFilters.priceMin}
                  onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || 0)}
                  className="px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="अधिकतम"
                  value={localFilters.priceMax}
                  onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || priceRange.max)}
                  className="px-3 py-2 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Brands */}
          {brands.length > 0 && (
            <div>
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">ब्रांड</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.brands.includes(brand.id)}
                      onChange={() => toggleArrayFilter('brands', brand.id)}
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 dark:text-emerald-300">{brand.name}</span>
                    <span className="text-emerald-500 dark:text-emerald-400 text-sm">({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">रेटिंग</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={localFilters.rating === rating}
                    onChange={() => updateFilter('rating', rating)}
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-emerald-700 dark:text-emerald-300 text-sm">और ऊपर</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Special Filters */}
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3">विशेष फ़िल्टर</h4>
            <div className="space-y-3">
              {[
                { key: 'inStock', label: 'स्टॉक में उपलब्ध', icon: '✅' },
                { key: 'onSale', label: 'छूट में', icon: '🏷️' },
                { key: 'handmade', label: 'हस्तनिर्मित', icon: '🖐️' },
                { key: 'newArrivals', label: 'नए आगमन', icon: '🆕' }
              ].map(filter => (
                <label key={filter.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters[filter.key]}
                    onChange={(e) => updateFilter(filter.key, e.target.checked)}
                    className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-lg">{filter.icon}</span>
                  <span className="text-emerald-700 dark:text-emerald-300">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;