import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Filter, ChevronDown, Search, Zap } from 'lucide-react';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import './Events.css';

interface EventType {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image?: string;
}

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulate loading state on initial load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Empty placeholder events
  const eventsCategories = [
    { title: 'Alumni Homecoming', color: '#4f46e5', date: 'September 15, 2023', time: '2:00 PM', location: 'Main Campus Auditorium' },
    { title: 'Career Fair', color: '#8b5cf6', date: 'October 5, 2023', time: '10:00 AM', location: 'Innovation Center' },
    { title: 'Class Reunion', color: '#ec4899', date: 'November 20, 2023', time: '6:00 PM', location: 'Grand Ballroom' }
  ];

  return (
    <div className="events-page">
      <div className="events-layout">
        <div className="events-content">
          <div className="events-header">
            <div className="events-title-section">
              <div className="events-icon">
                <Calendar size={24} />
              </div>
              <h1>Alumni Events</h1>
            </div>
            
            <div className="events-filter-wrapper">
              <div className="filter-dropdown">
                <button className="filter-button">
                  <Filter size={16} />
                  <span>Filter</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="events-controls">
            <div className="events-search">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="events-tabs">
              <button 
                className={`events-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <Zap size={16} />
                All Events
              </button>
              <button 
                className={`events-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                <Calendar size={16} />
                Upcoming
              </button>
              <button 
                className={`events-tab ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                <Clock size={16} />
                Past Events
              </button>
            </div>
          </div>

          <div className="events-section">
            <h2>Activities & Events</h2>
            
            {isLoading ? (
              <div className="loading-events">
                <div className="events-skeleton-grid">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="event-skeleton-item"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-events">
                <div className="events-grid">
                  {eventsCategories.map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-image">
                        <ImagePlaceholder
                          shape="rectangle"
                          height="200px"
                          color={event.color}
                          recommendedSize="800x450px"
                        />
                      </div>
                      <div className="event-content">
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-details">
                          <div className="event-detail">
                            <Calendar size={14} />
                            <span>{event.date}</span>
                          </div>
                          <div className="event-detail">
                            <Clock size={14} />
                            <span>{event.time}</span>
                          </div>
                          <div className="event-detail">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <p className="event-placeholder-text">Event details will appear here once added.</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="empty-message">No actual events found. Add events to see them here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 