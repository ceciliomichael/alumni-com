import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Image, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getAllGalleryItems, 
  searchGalleryItems, 
  deleteGalleryItem, 
  initializeGalleryData,
  approveGalleryItem
} from '../../services/localStorage/galleryService';
import { GalleryItem } from '../../services/localStorage/galleryService';
import { getAllEvents } from '../../services/localStorage/eventService';
import { Event } from '../../services/localStorage/eventService';
import AdminLayout from '../../layout/AdminLayout';
import './Gallery.css';

const GalleryManagement = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sample data if empty
    initializeGalleryData();
    
    // Load gallery data
    loadGalleryData();
    
    // Load events for filtering
    const events = getAllEvents();
    setEvents(events);
  }, []);

  const loadGalleryData = () => {
    let filteredItems = getAllGalleryItems();
    
    // Apply event filter
    if (eventFilter !== 'all') {
      filteredItems = filteredItems.filter(item => item.eventId === eventFilter);
    }
    
    // Apply approval filter
    if (approvalFilter !== 'all') {
      const isApproved = approvalFilter === 'approved';
      filteredItems = filteredItems.filter(item => item.isApproved === isApproved);
    }
    
    setGalleryItems(filteredItems);
  };

  useEffect(() => {
    loadGalleryData();
  }, [eventFilter, approvalFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Loading is handled by the useEffect with searchQuery dependency
  };

  useEffect(() => {
    // Apply search filter
    if (searchQuery.trim()) {
      const results = searchGalleryItems(searchQuery);
      setGalleryItems(results);
    } else {
      loadGalleryData();
    }
  }, [searchQuery, eventFilter, approvalFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      deleteGalleryItem(id);
      loadGalleryData();
    }
  };

  const handleApprove = (id: string, approve: boolean) => {
    approveGalleryItem(id, approve);
    loadGalleryData();
  };

  const getEventTitle = (eventId?: string) => {
    if (!eventId) return 'No Event';
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="admin-toolbar">
        <div className="admin-search">
          <Search className="admin-search-icon" size={20} />
          <input
            type="text"
            placeholder="Search gallery..."
            className="admin-search-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="admin-filters">
          <select 
            className="admin-filter-select"
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
          >
            <option value="all">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
          
          <select 
            className="admin-filter-select"
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value as 'all' | 'approved' | 'pending')}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <button 
          className="admin-add-btn"
          onClick={() => navigate('/admin/gallery/add')}
        >
          <Plus size={20} />
          Add Gallery Item
        </button>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Gallery Items</h2>
          <div>{galleryItems.length} Items Found</div>
        </div>
        
        <div className="admin-gallery-grid">
          {galleryItems.length > 0 ? (
            galleryItems.map(item => (
              <div key={item.id} className="admin-gallery-card">
                <div className="admin-gallery-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} />
                  ) : (
                    <div className="admin-gallery-image-placeholder">
                      <Image size={40} />
                    </div>
                  )}
                  <div className={`admin-gallery-badge ${item.isApproved ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {item.isApproved ? 'Approved' : 'Pending'}
                  </div>
                </div>
                
                <div className="admin-gallery-content">
                  <h3 className="admin-gallery-title">{item.title}</h3>
                  
                  <div className="admin-gallery-event">
                    <span>Event: {getEventTitle(item.eventId)}</span>
                  </div>
                  
                  <div className="admin-gallery-date">
                    <span>Posted: {formatDate(item.postedDate)}</span>
                  </div>
                  
                  <p className="admin-gallery-description">
                    {item.description.length > 100 
                      ? `${item.description.substring(0, 100)}...` 
                      : item.description}
                  </p>
                  
                  <div className="admin-gallery-actions">
                    {!item.isApproved && (
                      <button 
                        className="admin-action-btn admin-action-approve"
                        onClick={() => handleApprove(item.id, true)}
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {item.isApproved && (
                      <button 
                        className="admin-action-btn admin-action-reject"
                        onClick={() => handleApprove(item.id, false)}
                        title="Unapprove"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button 
                      className="admin-action-btn admin-action-edit"
                      onClick={() => navigate(`/admin/gallery/edit/${item.id}`)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="admin-action-btn admin-action-delete"
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-empty-state">
              <Image size={48} />
              <h3>No gallery items found</h3>
              <p>There are no gallery items matching your search criteria.</p>
              <button 
                className="admin-btn-primary"
                onClick={() => navigate('/admin/gallery/add')}
              >
                Add Gallery Item
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryManagement; 