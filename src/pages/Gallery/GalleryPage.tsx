import { useState, useEffect, useRef } from 'react';
import { Image, Search, Grid, Bookmark, RefreshCw, Upload, Plus, X, ImagePlus, FileText } from 'lucide-react';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import GalleryCard from './components/GalleryCard';
import './Gallery.css';

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  album: string;
  likes: number;
}

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState<'select' | 'details' | 'success'>('select');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadDetails, setUploadDetails] = useState({
    title: '',
    album: 'Homecoming'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Albums categories
  const albumCategories = [
    'All Photos', 
    'Homecoming', 
    'Batch Reunions', 
    'Career Events', 
    'Awards', 
    'Community Service'
  ];
  
  // Simulate loading state on initial load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Clean up the object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Filter images based on search term and active album
  const filteredImages = galleryImages.filter(image => 
    (searchTerm === '' || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.album.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeAlbum === 'all' || image.album.toLowerCase() === activeAlbum.toLowerCase())
  );

  // Generate placeholder colors by album category
  const getColorByCategory = (category: string) => {
    const colorMap: Record<string, string> = {
      'Homecoming': '#4f46e5',
      'Batch Reunions': '#ec4899',
      'Career Events': '#8b5cf6',
      'Awards': '#f59e0b',
      'Community Service': '#14b8a6',
    };
    return colorMap[category] || '#64748b';
  };
  
  const handleRefreshGallery = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const handleAlbumChange = (album: string) => {
    setActiveAlbum(album.toLowerCase().replace(' ', '-'));
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
    setUploadStep('select');
    setUploadFile(null);
    setPreviewUrl('');
    setUploadDetails({
      title: '',
      album: 'Homecoming'
    });
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setUploadFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setUploadStep('details');
        setUploadDetails({
          ...uploadDetails,
          title: file.name.split('.')[0].replace(/[_-]/g, ' ')
        });
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUploadDetails({
      ...uploadDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleUploadSubmit = () => {
    // Here we'd normally send the file to the server
    // For now, just simulate a success response
    setTimeout(() => {
      setUploadStep('success');
    }, 1000);
  };

  const handleTryAgain = () => {
    setUploadStep('select');
    setUploadFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  return (
    <div className="gallery-page">
      <div className="gallery-layout">
        <div className="gallery-content">
          <div className="gallery-header">
            <div className="gallery-title-section">
              <div className="gallery-icon">
                <Image size={24} />
              </div>
              <h1>Photo Gallery</h1>
            </div>
            
            <div className="gallery-actions">
              <button 
                className="upload-button" 
                onClick={openUploadModal}
                aria-label="Upload photo"
              >
                <Upload size={16} />
                <span>Upload</span>
              </button>
              <div className="view-toggle">
                <button 
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`view-mode-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                  onClick={() => setViewMode('masonry')}
                  aria-label="Masonry view"
                >
                  <Bookmark size={18} />
                </button>
              </div>
              
              <button className="refresh-button" onClick={handleRefreshGallery} disabled={isLoading}>
                <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
              </button>
            </div>
          </div>
          
          <div className="gallery-controls">
            <div className="gallery-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search photos by title or album..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="gallery-filters">
              {albumCategories.map((album, index) => (
                <button 
                  key={index} 
                  className={`album-filter ${activeAlbum === album.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
                  onClick={() => handleAlbumChange(album)}
                >
                  {album}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-gallery">
              <div className="gallery-skeleton-grid">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="gallery-skeleton-item"></div>
                ))}
              </div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className={`gallery-grid ${viewMode === 'masonry' ? 'masonry-layout' : ''}`}>
              {filteredImages.map(image => (
                <div key={image.id} className={`gallery-item ${viewMode === 'masonry' ? 'masonry-item' : ''}`}>
                  <GalleryCard image={image} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-gallery">
              <div className="empty-state-icon">
                <Image size={64} strokeWidth={1} color="#64748b" />
              </div>
              <h3 className="empty-state-title">No photos found</h3>
              <p className="empty-state-message">
                {searchTerm ? 
                  "No photos match your search criteria. Try a different search term." : 
                  activeAlbum !== 'all' ? 
                    `There are no photos in the ${activeAlbum.replace('-', ' ')} album yet.` : 
                    "There are no photos in the gallery yet. Check back later or upload photos yourself!"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h2>
                {uploadStep === 'select' && 'Upload a Photo'}
                {uploadStep === 'details' && 'Photo Details'}
                {uploadStep === 'success' && 'Upload Successful'}
              </h2>
              <button className="close-modal" onClick={closeUploadModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {uploadStep === 'select' && (
                <div className="upload-select-step">
                  <div className="upload-drop-area" onClick={triggerFileInput}>
                    <ImagePlus size={48} />
                    <h3>Select a photo to upload</h3>
                    <p>Click to browse or drag and drop your photo here</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button className="btn-select-file">
                      <Plus size={16} />
                      Select Photo
                    </button>
                  </div>

                  <div className="upload-guidelines">
                    <FileText size={20} />
                    <div>
                      <h4>Upload Guidelines</h4>
                      <ul>
                        <li>Accepted formats: JPG, PNG, GIF</li>
                        <li>Maximum file size: 10MB</li>
                        <li>All uploads require admin approval</li>
                        <li>Photos must be appropriate for all audiences</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === 'details' && previewUrl && (
                <div className="upload-details-step">
                  <div className="preview-image-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  </div>
                  
                  <div className="upload-form">
                    <div className="form-group">
                      <label htmlFor="title">Photo Title*</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={uploadDetails.title}
                        onChange={handleUploadDetailsChange}
                        required
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="album">Album*</label>
                      <select
                        id="album"
                        name="album"
                        value={uploadDetails.album}
                        onChange={handleUploadDetailsChange}
                        className="form-control"
                      >
                        {albumCategories.slice(1).map((album, index) => (
                          <option key={index} value={album}>
                            {album}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="admin-notice">
                      <div className="admin-notice-icon">!</div>
                      <p>Your upload will be reviewed by an admin before appearing in the gallery.</p>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === 'success' && (
                <div className="upload-success-step">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                      <path
                        fill="#10b981"
                        d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm0-18c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.3 5.3l-4.6 4.6-2-2L7.3 13.3l3.4 3.4 6-6-1.4-1.4z"
                      ></path>
                    </svg>
                  </div>
                  <h3>Thank you for your submission!</h3>
                  <p>Your photo has been successfully uploaded and is pending admin approval.</p>
                  <p>You'll be notified when your photo is approved and added to the gallery.</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {uploadStep === 'select' && (
                <button className="btn btn-secondary" onClick={closeUploadModal}>
                  Cancel
                </button>
              )}
              
              {uploadStep === 'details' && (
                <>
                  <button className="btn btn-secondary" onClick={handleTryAgain}>
                    Back
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUploadSubmit}
                    disabled={!uploadDetails.title}
                  >
                    Upload Photo
                  </button>
                </>
              )}
              
              {uploadStep === 'success' && (
                <>
                  <button className="btn btn-secondary" onClick={openUploadModal}>
                    Upload Another
                  </button>
                  <button className="btn btn-primary" onClick={closeUploadModal}>
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage; 