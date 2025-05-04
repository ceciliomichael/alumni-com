import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image, Calendar, CheckCircle, Clock } from 'lucide-react';
import { 
  addGalleryItem, 
  getGalleryItemById, 
  updateGalleryItem,
  initializeGalleryData
} from '../../services/localStorage/galleryService';
import { GalleryItem } from '../../services/localStorage/galleryService';
import { getAllEvents } from '../../services/localStorage/eventService';
import { Event } from '../../services/localStorage/eventService';
import AdminLayout from '../../layout/AdminLayout';
import './Gallery.css';
import './GalleryForm.css';

type GalleryFormData = Omit<GalleryItem, 'id' | 'postedDate'>;

const GalleryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    imageUrl: '',
    eventId: '',
    isApproved: false,
    postedBy: 'admin'
  });
  
  const [events, setEvents] = useState<Event[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Initialize sample data if empty
    initializeGalleryData();
    
    // Load events for the dropdown
    const allEvents = getAllEvents();
    setEvents(allEvents);
    
    // If editing, fetch gallery item data
    if (isEditing && id) {
      const galleryData = getGalleryItemById(id);
      
      if (galleryData) {
        // Exclude id and postedDate from the form
        const { id: _, postedDate: __, ...restData } = galleryData;
        setFormData(restData);
      } else {
        // Handle case where gallery item doesn't exist
        navigate('/admin/gallery');
      }
    }
  }, [id, isEditing, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && id) {
        updateGalleryItem(id, formData);
      } else {
        addGalleryItem(formData);
      }
      
      navigate('/admin/gallery');
    } catch (error) {
      console.error('Error saving gallery item:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout title={isEditing ? 'Edit Gallery Item' : 'Add Gallery Item'}>
      <div className="admin-toolbar">
        <button 
          className="admin-back-btn"
          onClick={() => navigate('/admin/gallery')}
        >
          <ArrowLeft size={20} />
          Back to Gallery
        </button>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            {isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
        </div>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Gallery Item Information</h3>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="title" className="admin-form-label">
                  <Image size={16} className="admin-form-icon" />
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`admin-form-input ${errors.title ? 'admin-input-error' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter gallery item title"
                />
                {errors.title && <div className="admin-form-error">{errors.title}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="eventId" className="admin-form-label">
                  <Calendar size={16} className="admin-form-icon" />
                  Related Event
                </label>
                <select
                  id="eventId"
                  name="eventId"
                  className="admin-gallery-event-select"
                  value={formData.eventId || ''}
                  onChange={handleChange}
                >
                  <option value="">-- No related event --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
                <div className="admin-form-hint">Associate this gallery item with an event (optional).</div>
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="description" className="admin-form-label">
                  <Image size={16} className="admin-form-icon" />
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className={`admin-form-textarea ${errors.description ? 'admin-input-error' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                ></textarea>
                {errors.description && <div className="admin-form-error">{errors.description}</div>}
              </div>
            </div>
          </div>
          
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Image</h3>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="imageUrl" className="admin-form-label">
                  <Image size={16} className="admin-form-icon" />
                  Image URL *
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  className={`admin-form-input ${errors.imageUrl ? 'admin-input-error' : ''}`}
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
                {errors.imageUrl && <div className="admin-form-error">{errors.imageUrl}</div>}
                <div className="admin-form-hint">Enter the URL for the gallery image.</div>
                
                <div className="admin-gallery-image-preview">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Gallery preview" />
                  ) : (
                    <div className="admin-gallery-image-placeholder">
                      <Image size={32} />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Status</h3>
            
            <div className="admin-form-row">
              <div className="admin-gallery-status-container">
                <div>
                  <div className={`admin-gallery-status-badge ${formData.isApproved ? 'admin-gallery-status-badge-approved' : 'admin-gallery-status-badge-pending'}`}>
                    {formData.isApproved ? (
                      <>
                        <CheckCircle size={14} />
                        Approved
                      </>
                    ) : (
                      <>
                        <Clock size={14} />
                        Pending Approval
                      </>
                    )}
                  </div>
                </div>
                
                <div className="admin-form-checkbox-group">
                  <label className="admin-form-checkbox-container">
                    <input
                      type="checkbox"
                      name="isApproved"
                      checked={formData.isApproved}
                      onChange={handleChange}
                    />
                    <span className="admin-form-checkbox-label">Approve Gallery Item</span>
                  </label>
                  <div className="admin-form-hint">
                    Approved gallery items will be visible to all alumni. Unapproved items will be hidden.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-form-actions">
            <button 
              type="button" 
              className="admin-form-cancel"
              onClick={() => navigate('/admin/gallery')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="admin-form-submit"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isEditing ? 'Update Gallery Item' : 'Save Gallery Item'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default GalleryForm; 