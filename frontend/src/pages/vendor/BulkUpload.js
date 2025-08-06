// Bulk Upload Component - Bharatshala Vendor Platform
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const BulkUpload = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const supportedFormats = ['.csv', '.xlsx', '.xls'];

  const sampleData = [
    {
      field: 'name',
      description: 'प्रोडक्ट का नाम',
      example: 'हैंडमेड कॉटन कुर्ता',
      required: 'हां'
    },
    {
      field: 'description',
      description: 'प्रोडक्ट का विवरण',
      example: '100% कॉटन, हैंडवूवन...',
      required: 'हां'
    },
    {
      field: 'category',
      description: 'श्रेणी',
      example: 'clothing',
      required: 'हां'
    },
    {
      field: 'subcategory',
      description: 'उप-श्रेणी',
      example: 'ethnic-wear',
      required: 'हां'
    },
    {
      field: 'price',
      description: 'मूल्य (₹ में)',
      example: '1299',
      required: 'हां'
    },
    {
      field: 'original_price',
      description: 'मूल मूल्य (₹ में)',
      example: '1599',
      required: 'नहीं'
    },
    {
      field: 'sku',
      description: 'SKU कोड',
      example: 'KRT-001-M',
      required: 'हां'
    },
    {
      field: 'stock_quantity',
      description: 'स्टॉक मात्रा',
      example: '50',
      required: 'हां'
    },
    {
      field: 'weight',
      description: 'वजन (ग्राम में)',
      example: '300',
      required: 'हां'
    },
    {
      field: 'dimensions',
      description: 'आयाम (L×W×H cm)',
      example: '30×25×2',
      required: 'नहीं'
    },
    {
      field: 'material',
      description: 'सामग्री',
      example: 'Cotton',
      required: 'नहीं'
    },
    {
      field: 'color',
      description: 'रंग',
      example: 'Blue',
      required: 'नहीं'
    },
    {
      field: 'size',
      description: 'साइज़',
      example: 'M',
      required: 'नहीं'
    },
    {
      field: 'brand',
      description: 'ब्रांड',
      example: 'Traditional Crafts',
      required: 'नहीं'
    },
    {
      field: 'tags',
      description: 'टैग्स (कॉमा से अलग)',
      example: 'handmade,cotton,ethnic',
      required: 'नहीं'
    },
    {
      field: 'image_urls',
      description: 'इमेज URLs (कॉमा से अलग)',
      example: 'https://example.com/img1.jpg,https://example.com/img2.jpg',
      required: 'नहीं'
    }
  ];

  const uploadSteps = [
    {
      step: 1,
      title: 'टेम्प्लेट डाउनलोड करें',
      description: 'नीचे दिए गए टेम्प्लेट को डाउनलोड करें और अपना डेटा भरें'
    },
    {
      step: 2,
      title: 'फाइल अपलोड करें',
      description: 'भरे गए टेम्प्लेट को यहाँ अपलोड करें (CSV या Excel)'
    },
    {
      step: 3,
      title: 'वेरिफिकेशन',
      description: 'सिस्टम आपके डेटा को वेरिफाई करेगा'
    },
    {
      step: 4,
      title: 'इम्पोर्ट',
      description: 'वेरिफाई ह