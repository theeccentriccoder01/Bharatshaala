import React, { useState, useRef } from 'react';

const ImageUploader = ({ images = [], onImagesChange, maxImages = 8, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList) => {
    if (images.length >= maxImages) {
      alert(`अधिकतम ${maxImages} छवियां अपलोड कर सकते हैं`);
      return;
    }

    const files = Array.from(fileList);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('कुछ फाइलें अमान्य हैं। केवल छवि फाइलें (5MB तक) स्वीकार्य हैं।');
    }

    setUploading(true);
    
    const newImages = [];
    for (const file of validFiles) {
      if (images.length + newImages.length >= maxImages) break;
      
      try {
        const imageUrl = await uploadImageToServer(file);
        newImages.push({
          id: Date.now() + Math.random(),
          url: imageUrl,
          file: file,
          name: file.name
        });
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }

    setUploading(false);
    onImagesChange([...images, ...newImages]);
  };

  const uploadImageToServer = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    onImagesChange(updatedImages);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        {uploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="text-emerald-600 font-medium">छवियां अपलोड हो रही हैं...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl text-emerald-400">📸</div>
            <div>
              <p className="text-emerald-800 font-semibold text-lg mb-2">
                छवियां खींचें और छोड़ें या क्लिक करें
              </p>
              <p className="text-emerald-600 text-sm">
                PNG, JPG, WEBP तक 5MB ({maxImages - images.length} और जोड़ सकते हैं)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative group bg-white rounded-xl overflow-hidden shadow-lg border-2 border-emerald-200"
            >
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      className="p-2 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors duration-200"
                      title="बाएं ले जाएं"
                    >
                      ←
                    </button>
                  )}
                  
                  {/* Remove */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    title="हटाएं"
                  >
                    ×
                  </button>
                  
                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      className="p-2 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors duration-200"
                      title="दाएं ले जाएं"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>

              {/* Main Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  मुख्य
                </div>
              )}

              {/* Image Number */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                {index + 1}
              </div>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxImages && (
            <button
              onClick={onButtonClick}
              className="h-32 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
            >
              <span className="text-2xl mb-2">+</span>
              <span className="text-sm font-medium">और जोड़ें</span>
            </button>
          )}
        </div>
      )}

      {/* Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
          <span>💡</span>
          <span>छवि टिप्स:</span>
        </h4>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• पहली छवि मुख्य छवि होगी और थंबनेल के रूप में दिखाई जाएगी</li>
          <li>• उत्पाद को अलग-अलग कोणों से दिखाएं</li>
          <li>• अच्छी रोशनी में साफ तस्वीरें लें</li>
          <li>• छवियों को ऊपर-नीचे करने के लिए तीर बटन का उपयोग करें</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUploader;