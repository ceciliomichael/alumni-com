import { useState } from 'react';
import { Search, Briefcase, Filter, MapPin, Calendar, Plus } from 'lucide-react';
import './Jobs.css';
import { Job } from '../../types';

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter jobs based on search term and active filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch(activeFilter) {
      case 'recent':
        // Return only jobs posted in the last 7 days
        return matchesSearch && (new Date().getTime() - new Date(job.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000);
      case 'saved':
        // This would need to be implemented with actual saved jobs logic
        return matchesSearch && false; // Placeholder for saved jobs filter
      default:
        return matchesSearch;
    }
  });

  const handleCreateJob = () => {
    setShowCreateJobModal(true);
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1 className="page-title">Job Opportunities</h1>
        <button className="create-job-button" onClick={handleCreateJob}>
          <Plus size={16} />
          <span>Post a Job</span>
        </button>
      </div>

      <div className="jobs-filters">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Jobs
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recent')}
          >
            Recent
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('saved')}
          >
            Saved
          </button>
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-company">{job.company}</span>
              </div>
              
              <div className="job-details">
                <div className="job-detail">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                <div className="job-detail">
                  <Calendar size={16} />
                  <span>Posted {formatDate(job.createdAt)}</span>
                </div>
              </div>
              
              <p className="job-description">{job.description}</p>
              
              <div className="job-requirements">
                <h4>Requirements:</h4>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="job-actions">
                <button className="apply-button">Apply Now</button>
                <button className="save-button">Save</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-jobs">
            <div className="empty-jobs-icon">
              <Briefcase size={64} color="#64748b" strokeWidth={1.5} />
            </div>
            <h3>No jobs found</h3>
            <p>
              There are no job opportunities available right now. Check back later or post a job yourself!
            </p>
          </div>
        )}
      </div>

      {/* Job Creation Modal - Would be implemented in a real application */}
      {showCreateJobModal && (
        <div className="modal-overlay" onClick={() => setShowCreateJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Job Opportunity</h2>
            <form className="job-form">
              <div className="form-group">
                <label>Job Title</label>
                <input type="text" placeholder="e.g., Senior Developer" />
              </div>
              
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" placeholder="e.g., Tech Solutions Inc." />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="e.g., Remote, New York, NY" />
              </div>
              
              <div className="form-group">
                <label>Job Description</label>
                <textarea placeholder="Describe the job role, responsibilities, etc."></textarea>
              </div>
              
              <div className="form-group">
                <label>Requirements (one per line)</label>
                <textarea placeholder="e.g., 5+ years of experience&#10;Bachelor's degree in Computer Science"></textarea>
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" placeholder="e.g., hiring@example.com" />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowCreateJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage; 