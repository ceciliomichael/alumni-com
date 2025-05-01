import { useState, useEffect } from 'react';
import { User, Edit, AtSign, Briefcase, Calendar, MapPin, Camera, Save } from 'lucide-react';
import { User as UserType } from '../../types';
import './Profile.css';

interface ProfilePageProps {
  user?: UserType | null;
  isEditing?: boolean;
}

interface Post {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

const ProfilePage = ({ user: propUser, isEditing: initialEditMode = false }: ProfilePageProps) => {
  const [user, setUser] = useState<UserType | null>(propUser || null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [formData, setFormData] = useState({
    name: propUser?.name || '',
    email: propUser?.email || '',
    batch: propUser?.batch || '',
    job: '',
    company: '',
    location: '',
    bio: '',
    linkedin: '',
    twitter: '',
    website: ''
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setFormData({
        name: propUser.name || '',
        email: propUser.email || '',
        batch: propUser.batch || '',
        job: '',
        company: '',
        location: '',
        bio: '',
        linkedin: '',
        twitter: '',
        website: ''
      });
    }
  }, [propUser]);

  // Update editing state when initialEditMode changes
  useEffect(() => {
    setIsEditing(initialEditMode);
  }, [initialEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would send data to the backend
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        batch: formData.batch
      });
    }
    setIsEditing(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get initial for avatar placeholder
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <p>User profile not found or not loaded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <button className="change-cover-btn">
            <Camera size={16} />
            <span>Change Cover</span>
          </button>
        </div>
        
        <div className="profile-info-wrapper">
          <div className="profile-avatar">
            <img src={user.profileImage || '/images/avatars/default.jpg'} alt={user.name} />
            <button className="change-avatar-btn">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="profile-info">
            <div className="profile-name-section">
              <h1>{user.name}</h1>
              {!isEditing && (
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            <div className="profile-details">
              <div className="profile-detail">
                <Briefcase size={16} />
                <span>Software Engineer at Tech Solutions Inc.</span>
              </div>
              <div className="profile-detail">
                <Calendar size={16} />
                <span>Batch {user.batch}</span>
              </div>
              <div className="profile-detail">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
              <div className="profile-detail">
                <AtSign size={16} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-card">
            <h3>About Me</h3>
            <p>Alumni with a passion for technology and innovation. Currently working on AI solutions for healthcare.</p>
          </div>
          
          <div className="profile-card">
            <h3>Connect With Me</h3>
            <div className="social-links">
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Website</a>
            </div>
          </div>
          
          <div className="profile-card">
            <h3>My Activity</h3>
            <div className="activity-stats">
              <div className="activity-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="activity-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Comments</div>
              </div>
              <div className="activity-stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Events</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-main">
          {isEditing ? (
            <div className="profile-edit-card">
              <h2>Update Profile</h2>
              <form className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder={user.name}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder={user.email}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="batch">Batch</label>
                    <input 
                      type="text" 
                      id="batch" 
                      name="batch" 
                      value={formData.batch} 
                      onChange={handleInputChange} 
                      placeholder={user.batch}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="job">Job Title</label>
                    <input 
                      type="text" 
                      id="job" 
                      name="job" 
                      value={formData.job} 
                      onChange={handleInputChange} 
                      placeholder="Job Title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleInputChange} 
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input 
                      type="text" 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      placeholder="City, State"
                    />
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    rows={4} 
                    value={formData.bio} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                
                <h3>Social Media Links</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
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
                    <label htmlFor="twitter">Twitter</label>
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
                    <label htmlFor="website">Website</label>
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
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="save-btn"
                    onClick={handleSaveProfile}
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="profile-posts">
              <h2>My Posts</h2>
              {posts.length > 0 ? (
                <div className="posts-list">
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-content">
                        <p>{post.content}</p>
                      </div>
                      <div className="post-footer">
                        <div className="post-date">{formatDate(post.date)}</div>
                        <div className="post-stats">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>You haven't created any posts yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 