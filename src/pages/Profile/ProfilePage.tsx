import { useState } from 'react';
import { User } from '../../types';
import ProfileHeader from './components/ProfileHeader';
import ProfileAbout from './components/ProfileAbout';
import ProfileActivity from './components/ProfileActivity';
import ProfileForm from './components/ProfileForm';
import ProfilePosts from './components/ProfilePosts';
import { ProfileFormData } from './components/ProfileForm';
import './styles.css';

interface ProfilePageProps {
  user?: User | null;
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
  const [user, setUser] = useState<User | null>(propUser || null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [userInfo, setUserInfo] = useState({
    bio: 'Alumni with a passion for technology and innovation. Currently working on AI solutions for healthcare.',
    job: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    location: 'San Francisco, CA',
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: ''
    }
  });

  const handleSaveProfile = (formData: ProfileFormData) => {
    // In a real app, this would send data to the backend
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        batch: formData.batch
      });

      setUserInfo({
        bio: formData.bio,
        job: formData.job,
        company: formData.company,
        location: formData.location,
        socialLinks: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          website: formData.website
        }
      });
    }
    setIsEditing(false);
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

  const activityStats = {
    posts: posts.length,
    comments: 0,
    events: 0
  };

  return (
    <div className="profile-container">
      <ProfileHeader 
        user={user} 
        onEditClick={() => setIsEditing(true)} 
      />
      
      <div className="profile-content">
        {isEditing ? (
          <div className="profile-main-edit">
            <ProfileForm 
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            <div className="profile-sidebar">
              <ProfileAbout 
                bio={userInfo.bio}
                job={userInfo.job}
                company={userInfo.company}
                location={userInfo.location}
                socialLinks={userInfo.socialLinks}
              />
              <ProfileActivity stats={activityStats} />
            </div>
            
            <div className="profile-main">
              <ProfilePosts posts={posts} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 