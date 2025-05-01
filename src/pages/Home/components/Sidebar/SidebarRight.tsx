import { useState } from 'react';
import { Calendar, Briefcase, Users, Bell, ArrowRight } from 'lucide-react';
import ImagePlaceholder from '../../../../components/ImagePlaceholder';
import './Sidebar.css';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

interface Announcement {
  id: string;
  title: string;
  text: string;
  date: string;
}

interface Spotlight {
  id: string;
  name: string;
  batch: string;
  achievement: string;
  image?: string;
}

const SidebarRight = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<Job[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3 className="sidebar-title">
            <Calendar size={18} />
            <span>Upcoming Events</span>
          </h3>
          <a href="/events" className="see-all-link">
            See All
          </a>
        </div>
        
        <div className="sidebar-card-content">
          {upcomingEvents.length === 0 ? (
            <div className="empty-content">
              <ImagePlaceholder
                shape="rectangle"
                height="120px"
                color="#0984e3"
                recommendedSize="800x400px"
              />
              <p className="no-items-message">No upcoming events</p>
            </div>
          ) : (
            <ul className="sidebar-list">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="sidebar-list-item event-item">
                  <div className="event-date-badge">
                    <span className="event-month">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="event-day">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="sidebar-item-content">
                    <h4 className="sidebar-item-title">{event.title}</h4>
                    <p className="sidebar-item-subtitle">{event.location}</p>
                    <p className="sidebar-item-info">{formatDate(event.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3 className="sidebar-title">
            <Briefcase size={18} />
            <span>Job Opportunities</span>
          </h3>
          <a href="/jobs" className="see-all-link">
            See All
          </a>
        </div>
        
        <div className="sidebar-card-content">
          {jobOpportunities.length === 0 ? (
            <div className="empty-content">
              <ImagePlaceholder
                shape="square"
                height="100px"
                color="#00b894"
                recommendedSize="400x400px"
              />
              <p className="no-items-message">No job opportunities</p>
            </div>
          ) : (
            <ul className="sidebar-list">
              {jobOpportunities.map((job) => (
                <li key={job.id} className="sidebar-list-item job-item">
                  <div className="sidebar-item-content">
                    <h4 className="sidebar-item-title">{job.title}</h4>
                    <p className="sidebar-item-subtitle">{job.company}</p>
                    <p className="sidebar-item-info">{job.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {jobOpportunities.length > 0 && (
            <a href="/jobs" className="view-all-button">
              <span>View All Job Opportunities</span>
              <ArrowRight size={16} />
            </a>
          )}
        </div>
      </div>
      
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3 className="sidebar-title">
            <Bell size={18} />
            <span>Announcements</span>
          </h3>
        </div>
        
        <div className="announcement-content">
          {announcements.length === 0 ? (
            <div className="empty-content">
              <ImagePlaceholder
                shape="rectangle"
                height="80px"
                color="#e17055"
                recommendedSize="600x300px"
              />
              <p className="no-items-message">No announcements</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <h4 className="announcement-title">{announcement.title}</h4>
                <p className="announcement-text">{announcement.text}</p>
                <p className="announcement-date">{formatDate(announcement.date)}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <h3 className="sidebar-title">
            <Users size={18} />
            <span>Alumni Spotlight</span>
          </h3>
        </div>
        
        <div className="spotlight-content">
          {spotlight ? (
            <div className="spotlight-card">
              <div className="spotlight-image">
                {spotlight.image ? (
                  <img src={spotlight.image} alt={`${spotlight.name} - Alumni Spotlight`} />
                ) : (
                  <ImagePlaceholder 
                    shape="circle" 
                    width="80px" 
                    height="80px" 
                    color="#e74c3c" 
                    text={spotlight.name.charAt(0)}
                    recommendedSize="200x200px"
                  />
                )}
              </div>
              <h4 className="spotlight-name">{spotlight.name}</h4>
              <p className="spotlight-batch">Batch {spotlight.batch}</p>
              <p className="spotlight-achievement">{spotlight.achievement}</p>
            </div>
          ) : (
            <div className="empty-spotlight">
              <ImagePlaceholder 
                shape="circle" 
                width="80px" 
                height="80px" 
                color="#7f8c8d" 
                recommendedSize="200x200px"
              />
              <p className="no-items-message">No spotlight feature</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight; 