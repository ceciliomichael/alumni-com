import { useState } from 'react';
import { Calendar, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const SidebarRight = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<Job[]>([]);

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
          <Link to="/events" className="see-all-link">
            See All
          </Link>
        </div>
        
        <div className="sidebar-card-content">
          {upcomingEvents.length === 0 ? (
            <div className="empty-content">
              <Link to="/events">
                <ImagePlaceholder
                  shape="rectangle"
                  height="120px"
                  color="#0984e3"
                  recommendedSize="800x400px"
                />
              </Link>
              <p className="no-items-message">No upcoming events</p>
            </div>
          ) : (
            <ul className="sidebar-list">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="sidebar-list-item event-item">
                  <Link to="/events" className="sidebar-item-link">
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
                  </Link>
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
          <Link to="/jobs" className="see-all-link">
            See All
          </Link>
        </div>
        
        <div className="sidebar-card-content">
          {jobOpportunities.length === 0 ? (
            <div className="empty-content">
              <Link to="/jobs">
                <ImagePlaceholder
                  shape="square"
                  height="100px"
                  color="#00b894"
                  recommendedSize="400x400px"
                />
              </Link>
              <p className="no-items-message">No job opportunities</p>
            </div>
          ) : (
            <ul className="sidebar-list">
              {jobOpportunities.map((job) => (
                <li key={job.id} className="sidebar-list-item job-item">
                  <Link to="/jobs" className="sidebar-item-link">
                    <div className="sidebar-item-content">
                      <h4 className="sidebar-item-title">{job.title}</h4>
                      <p className="sidebar-item-subtitle">{job.company}</p>
                      <p className="sidebar-item-info">{job.location}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          
          {jobOpportunities.length > 0 && (
            <Link to="/jobs" className="view-all-button">
              <span>View All Job Opportunities</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarRight; 