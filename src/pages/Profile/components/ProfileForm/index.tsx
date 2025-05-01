import { useState, ChangeEvent } from 'react';
import { Save, X, User, AtSign, Briefcase, Building, MapPin, FileText, Linkedin, Twitter, Globe } from 'lucide-react';
import { User as UserType } from '../../../../types';
import './styles.css';

interface ProfileFormProps {
  user: UserType;
  onSave: (formData: ProfileFormData) => void;
  onCancel: () => void;
}

export interface ProfileFormData {
  name: string;
  email: string;
  batch: string;
  job: string;
  company: string;
  location: string;
  bio: string;
  linkedin: string;
  twitter: string;
  website: string;
}

const ProfileForm = ({ user, onSave, onCancel }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user.name || '',
    email: user.email || '',
    batch: user.batch || '',
    job: '',
    company: '',
    location: '',
    bio: '',
    linkedin: '',
    twitter: '',
    website: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="profile-form-container">
      <div className="form-header">
        <h2>Edit Profile</h2>
        <button type="button" className="close-btn" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <User size={16} />
                <span>Full Name</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <AtSign size={16} />
                <span>Email</span>
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="Your email address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="batch">
                <User size={16} />
                <span>Batch</span>
              </label>
              <input 
                type="text" 
                id="batch" 
                name="batch" 
                value={formData.batch} 
                onChange={handleInputChange} 
                placeholder="Your batch year"
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Professional Information</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="job">
                <Briefcase size={16} />
                <span>Job Title</span>
              </label>
              <input 
                type="text" 
                id="job" 
                name="job" 
                value={formData.job} 
                onChange={handleInputChange} 
                placeholder="Your job title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">
                <Building size={16} />
                <span>Company</span>
              </label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formData.company} 
                onChange={handleInputChange} 
                placeholder="Company name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">
                <MapPin size={16} />
                <span>Location</span>
              </label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange} 
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="bio">
              <FileText size={16} />
              <span>Bio</span>
            </label>
            <textarea 
              id="bio" 
              name="bio" 
              rows={4} 
              value={formData.bio} 
              onChange={handleInputChange} 
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Social Media</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="linkedin">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </label>
              <input 
                type="text" 
                id="linkedin" 
                name="linkedin" 
                value={formData.linkedin} 
                onChange={handleInputChange} 
                placeholder="LinkedIn profile URL"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="twitter">
                <Twitter size={16} />
                <span>Twitter</span>
              </label>
              <input 
                type="text" 
                id="twitter" 
                name="twitter" 
                value={formData.twitter} 
                onChange={handleInputChange} 
                placeholder="Twitter handle"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="website">
                <Globe size={16} />
                <span>Website</span>
              </label>
              <input 
                type="text" 
                id="website" 
                name="website" 
                value={formData.website} 
                onChange={handleInputChange} 
                placeholder="Personal website URL"
              />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button 
            type="submit" 
            className="save-button"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm; 