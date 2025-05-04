import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Image, MapPin, CheckCircle, Clock } from 'lucide-react';
import { 
  addEvent, 
  getEventById, 
  updateEvent,
  initializeEventData
} from '../../services/localStorage/eventService';
import { Event } from '../../services/localStorage/eventService';
import AdminLayout from '../../layout/AdminLayout';
import './Events.css';
import './EventForm.css';

type EventFormData = Omit<Event, 'id' | 'createdAt'>;

const EventForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString(),
    isApproved: false,
    createdBy: 'admin',
    coverImage: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Initialize sample data if empty
    initializeEventData();
    
    // If editing, fetch event data
    if (isEditing && id) {
      const eventData = getEventById(id);
      
      if (eventData) {
        // Exclude id and createdAt from the form
        const { id: _, createdAt: __, ...restData } = eventData;
        setFormData(restData);
      } else {
        // Handle case where event doesn't exist
        navigate('/admin/events');
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
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Event location is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Event date and time is required';
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
        updateEvent(id, formData);
      } else {
        addEvent(formData);
      }
      
      navigate('/admin/events');
    } catch (error) {
      console.error('Error saving event:', error);
      setIsSubmitting(false);
    }
  };
  
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().substring(0, 16); // Format as YYYY-MM-DDThh:mm
  };
  
  return (
    <AdminLayout title={isEditing ? 'Edit Event' : 'Add Event'}>
      <div className="admin-toolbar">
        <button 
          className="admin-back-btn"
          onClick={() => navigate('/admin/events')}
        >
          <ArrowLeft size={20} />
          Back to Events
        </button>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            {isEditing ? 'Edit Event Information' : 'Add New Event'}
          </h2>
        </div>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Event Information</h3>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="title" className="admin-form-label">
                  <Calendar size={16} className="admin-form-icon" />
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`admin-form-input ${errors.title ? 'admin-input-error' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                />
                {errors.title && <div className="admin-form-error">{errors.title}</div>}
              </div>
            </div>
            
            <div className="admin-form-row admin-form-row-2">
              <div className="admin-form-group">
                <label htmlFor="location" className="admin-form-label">
                  <MapPin size={16} className="admin-form-icon" />
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className={`admin-form-input ${errors.location ? 'admin-input-error' : ''}`}
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                />
                {errors.location && <div className="admin-form-error">{errors.location}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="date" className="admin-form-label">
                  <Calendar size={16} className="admin-form-icon" />
                  Date and Time *
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  className={`admin-datetime-local ${errors.date ? 'admin-input-error' : ''}`}
                  value={formatDateForInput(formData.date)}
                  onChange={handleChange}
                />
                {errors.date && <div className="admin-form-error">{errors.date}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="description" className="admin-form-label">
                  <Calendar size={16} className="admin-form-icon" />
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className={`admin-form-textarea ${errors.description ? 'admin-input-error' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                ></textarea>
                {errors.description && <div className="admin-form-error">{errors.description}</div>}
              </div>
            </div>
          </div>
          
          <div className="admin-form-section">
            <h3 className="admin-form-section-title">Event Image</h3>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="coverImage" className="admin-form-label">
                  <Image size={16} className="admin-form-icon" />
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="coverImage"
                  name="coverImage"
                  className="admin-form-input"
                  value={formData.coverImage || ''}
                  onChange={handleChange}
                  placeholder="Enter cover image URL"
                />
                <div className="admin-form-hint">Enter a URL for the event cover image.</div>
                
                <div className="admin-image-preview">
                  {formData.coverImage ? (
                    <img src={formData.coverImage} alt="Cover preview" />
                  ) : (
                    <div className="admin-image-placeholder">
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
              <div className="admin-event-status-container">
                <div>
                  <div className={`admin-event-status-badge ${formData.isApproved ? 'admin-event-status-badge-approved' : 'admin-event-status-badge-pending'}`}>
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
                    <span className="admin-form-checkbox-label">Approve Event</span>
                  </label>
                  <div className="admin-form-hint">
                    Approved events will be visible to all alumni. Unapproved events will be hidden.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-form-actions">
            <button 
              type="button" 
              className="admin-form-cancel"
              onClick={() => navigate('/admin/events')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="admin-form-submit"
              disabled={isSubmitting}
            >
              <Save size={18} />
              {isEditing ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EventForm; 