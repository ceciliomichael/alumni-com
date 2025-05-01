import { Camera, Edit } from 'lucide-react';
import { User } from '../../../../types';
import './styles.css';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

const ProfileHeader = ({ user, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="profile-header">
      <div className="profile-cover">
        <div className="cover-overlay"></div>
        <button className="change-cover-btn">
          <Camera size={16} />
          <span>Change Cover</span>
        </button>
      </div>
      
      <div className="profile-info-wrapper">
        <div className="profile-avatar">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
          <button className="change-avatar-btn" aria-label="Change profile picture">
            <Camera size={16} />
          </button>
        </div>
        
        <div className="profile-info">
          <div className="profile-name-section">
            <h1>{user.name}</h1>
            <button 
              className="edit-profile-btn"
              onClick={onEditClick}
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          </div>
          <div className="profile-metadata">
            <div className="profile-batch">Batch {user.batch}</div>
            <div className="profile-email">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 