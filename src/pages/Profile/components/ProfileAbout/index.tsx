import { LinkedinIcon, TwitterIcon, GlobeIcon, UserCircle } from 'lucide-react';
import './styles.css';

interface ProfileAboutProps {
  bio?: string;
  job?: string;
  company?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

const ProfileAbout = ({ bio, job, company, location, socialLinks }: ProfileAboutProps) => {
  return (
    <div className="profile-about">
      <div className="about-section">
        <div className="section-header">
          <UserCircle size={20} />
          <h3>About Me</h3>
        </div>
        <div className="section-content">
          {bio ? (
            <p>{bio}</p>
          ) : (
            <p className="empty-bio">No bio information available</p>
          )}
          
          {(job || company || location) && (
            <div className="info-items">
              {job && (
                <div className="info-item">
                  <span className="info-label">Job Title:</span>
                  <span className="info-value">{job}</span>
                </div>
              )}
              
              {company && (
                <div className="info-item">
                  <span className="info-label">Company:</span>
                  <span className="info-value">{company}</span>
                </div>
              )}
              
              {location && (
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="social-section">
        <div className="section-header">
          <GlobeIcon size={20} />
          <h3>Connect With Me</h3>
        </div>
        <div className="section-content">
          {socialLinks && (Object.values(socialLinks).some(link => link)) ? (
            <div className="social-links">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} className="social-link linkedin" target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon size={18} />
                  <span>LinkedIn</span>
                </a>
              )}
              
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} className="social-link twitter" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon size={18} />
                  <span>Twitter</span>
                </a>
              )}
              
              {socialLinks.website && (
                <a href={socialLinks.website} className="social-link website" target="_blank" rel="noopener noreferrer">
                  <GlobeIcon size={18} />
                  <span>Website</span>
                </a>
              )}
            </div>
          ) : (
            <p className="empty-social">No social links added yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout; 