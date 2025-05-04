import { useState, useEffect } from 'react';
import { Search, Briefcase, Filter, MapPin, Calendar, Clock, Mail, Link, Plus } from 'lucide-react';
import './Jobs.css';
import { 
  getAllJobs, 
  getActiveJobs,
  addJob
} from '../Admin/services/localStorage/jobService';
import { Job } from '../Admin/services/localStorage/jobService';
import { getCurrentUser } from '../Admin/services/localStorage/userService';

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    contactEmail: '',
    jobType: 'fullTime' as Job['jobType'],
    salary: '',
    applicationType: 'email' as 'email' | 'website' | 'inPerson',
    applicationUrl: '',
    deadline: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    // Get all approved jobs
    const allJobs = getAllJobs().filter(job => job.isApproved);
    
    // Sort by posted date (newest first)
    allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    
    setJobs(allJobs);
  };

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
        return matchesSearch && (new Date().getTime() - new Date(job.postedDate).getTime() < 7 * 24 * 60 * 60 * 1000);
      case 'fullTime':
        return matchesSearch && job.jobType === 'fullTime';
      case 'partTime':
        return matchesSearch && job.jobType === 'partTime';
      case 'contract':
        return matchesSearch && job.jobType === 'contract';
      case 'internship':
        return matchesSearch && job.jobType === 'internship';
      default:
        return matchesSearch;
    }
  });

  const handleCreateJob = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('You must be logged in to post a job.');
      return;
    }
    setShowCreateJobModal(true);
  };

  const handleJobFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('You must be logged in to post a job');
      return;
    }
    
    // Create a deadline Date object if one was provided
    let deadlineDate = undefined;
    if (jobFormData.deadline) {
      deadlineDate = new Date(jobFormData.deadline).toISOString();
    }
    
    // Create the job object
    const newJob = {
      ...jobFormData,
      deadline: deadlineDate,
      isApproved: false, // Jobs require admin approval
      postedBy: currentUser.id
    };
    
    // Add the job
    addJob(newJob);
    
    // Close the modal and reset form
    setShowCreateJobModal(false);
    setJobFormData({
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: '',
      contactEmail: '',
      jobType: 'fullTime',
      salary: '',
      applicationType: 'email',
      applicationUrl: '',
      deadline: ''
    });
    
    // Show confirmation
    alert('Your job posting has been submitted and is pending approval.');
  };

  const getJobTypeLabel = (jobType: Job['jobType']) => {
    switch (jobType) {
      case 'fullTime': return 'Full-time';
      case 'partTime': return 'Part-time';
      case 'contract': return 'Contract';
      case 'internship': return 'Internship';
      default: return jobType;
    }
  };

  const isJobActive = (job: Job) => {
    if (!job.deadline) return true;
    const deadlineDate = new Date(job.deadline);
    return deadlineDate >= new Date();
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
            className={`filter-tab ${activeFilter === 'fullTime' ? 'active' : ''}`}
            onClick={() => setActiveFilter('fullTime')}
          >
            Full-time
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'partTime' ? 'active' : ''}`}
            onClick={() => setActiveFilter('partTime')}
          >
            Part-time
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'contract' ? 'active' : ''}`}
            onClick={() => setActiveFilter('contract')}
          >
            Contract
          </button>
          <button 
            className={`filter-tab ${activeFilter === 'internship' ? 'active' : ''}`}
            onClick={() => setActiveFilter('internship')}
          >
            Internship
          </button>
        </div>
      </div>

      <div className="jobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div className="job-title-area">
                  <h3 className="job-title">{job.title}</h3>
                  <div className="job-meta">
                    <span className="job-type">{getJobTypeLabel(job.jobType)}</span>
                    {!isJobActive(job) && <span className="job-expired">Expired</span>}
                  </div>
                </div>
                <a href="#" className="job-company">{job.company}</a>
              </div>
              
              <div className="job-details">
                {job.location && (
                  <div className="job-detail">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="job-detail">
                    <span className="peso-sign">₱</span>
                    <span>{job.salary}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="job-detail">
                    <Calendar size={16} />
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                )}
                <div className="job-detail">
                  <Clock size={16} />
                  <span>Posted: {formatDate(job.postedDate)}</span>
                </div>
              </div>
              
              {job.description && (
                <div className="job-description-section">
                  <p className="job-description">{job.description}</p>
                </div>
              )}
              
              {job.requirements && (
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <p>{job.requirements}</p>
                </div>
              )}
              
              <div className="job-apply-info">
                <h4>How to Apply:</h4>
                {job.applicationType === 'email' && (
                  <div className="job-application-method">
                    <Mail size={16} />
                    <span>Send your resume to: <a href={`mailto:${job.contactEmail}`} className="apply-link">{job.contactEmail}</a></span>
                  </div>
                )}
                {job.applicationType === 'website' && (
                  <div className="job-application-method">
                    <Link size={16} />
                    <span>Apply online: <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="apply-link">Application Portal</a></span>
                  </div>
                )}
                {job.applicationType === 'inPerson' && (
                  <div className="job-application-method">
                    <MapPin size={16} />
                    <span>Apply in person at the company address</span>
                  </div>
                )}
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

      {/* Job Creation Modal */}
      {showCreateJobModal && (
        <div className="modal-overlay" onClick={() => setShowCreateJobModal(false)}>
          <div className="modal-content job-create-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Job Opportunity</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowCreateJobModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <form className="job-form" onSubmit={handleJobSubmit}>
              <div className="form-group">
                <label htmlFor="jobTitle">Job Title</label>
                <input 
                  type="text" 
                  id="jobTitle"
                  name="title"
                  placeholder="e.g., Senior Developer" 
                  value={jobFormData.title}
                  onChange={handleJobFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input 
                  type="text" 
                  id="company"
                  name="company"
                  placeholder="e.g., Tech Solutions Inc." 
                  value={jobFormData.company}
                  onChange={handleJobFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location"
                  name="location"
                  placeholder="e.g., Remote, New York, NY" 
                  value={jobFormData.location}
                  onChange={handleJobFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="jobType">Job Type</label>
                <select 
                  id="jobType"
                  name="jobType"
                  className="form-select"
                  value={jobFormData.jobType}
                  onChange={handleJobFormChange}
                  required
                >
                  <option value="fullTime">Full-time</option>
                  <option value="partTime">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary (Optional)</label>
                <input 
                  type="text" 
                  id="salary"
                  name="salary"
                  placeholder="e.g., $60,000 - $80,000" 
                  value={jobFormData.salary}
                  onChange={handleJobFormChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deadline">Application Deadline (Optional)</label>
                <input 
                  type="date" 
                  id="deadline"
                  name="deadline"
                  value={jobFormData.deadline}
                  onChange={handleJobFormChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Job Description</label>
                <textarea 
                  id="description"
                  name="description"
                  placeholder="Describe the job role, responsibilities, etc."
                  value={jobFormData.description}
                  onChange={handleJobFormChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="requirements">Requirements</label>
                <textarea 
                  id="requirements"
                  name="requirements"
                  placeholder="List qualifications, skills, experience needed"
                  value={jobFormData.requirements}
                  onChange={handleJobFormChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="applicationType">Application Method</label>
                <select 
                  id="applicationType"
                  name="applicationType"
                  className="form-select"
                  value={jobFormData.applicationType}
                  onChange={handleJobFormChange}
                  required
                >
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                  <option value="inPerson">In Person</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input 
                  type="email" 
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="e.g., hiring@example.com" 
                  value={jobFormData.contactEmail}
                  onChange={handleJobFormChange}
                  required
                />
              </div>
              
              {jobFormData.applicationType === 'website' && (
                <div className="form-group">
                  <label htmlFor="applicationUrl">Application URL</label>
                  <input 
                    type="url" 
                    id="applicationUrl"
                    name="applicationUrl"
                    placeholder="e.g., https://company.com/apply" 
                    value={jobFormData.applicationUrl}
                    onChange={handleJobFormChange}
                    required={jobFormData.applicationType === 'website'}
                  />
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowCreateJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit Job
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