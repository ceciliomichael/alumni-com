import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../../types';
import ProfileHeader from './components/ProfileHeader';
import ProfileAbout from './components/ProfileAbout';
import ProfileActivity from './components/ProfileActivity';
import ProfileForm from './components/ProfileForm';
import ProfilePosts from './components/ProfilePosts';
import FollowersModal from './components/FollowersModal/FollowersModal';
import { ProfileFormData } from './components/ProfileForm';
import { 
  getUserById, 
  followUser, 
  unfollowUser, 
  isFollowing,
  getFollowers,
  getFollowing,
  updateUser,
  getCurrentUser
} from '../../pages/Admin/services/localStorage/userService';
import { getPostsByUserId } from '../../pages/Admin/services/localStorage/postService';
import './styles.css';

interface ProfilePageProps {
  user?: User | null;
  isEditing?: boolean;
  isViewingOtherUser?: boolean;
}

const ProfilePage = ({ 
  user: currentUser, 
  isEditing: initialEditMode = false, 
  isViewingOtherUser = false 
}: ProfilePageProps) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Load the profile data based on the userId param or the current user
  useEffect(() => {
    setIsLoading(true);
    
    const loadUserProfile = async () => {
      let userToDisplay = null;
      
      if (isViewingOtherUser && userId) {
        // Viewing another user's profile
        userToDisplay = getUserById(userId);
        
        // Check if current user is following this profile
        if (currentUser && userToDisplay) {
          const following = isFollowing(currentUser.id, userToDisplay.id);
          setIsFollowingUser(following);
        }
      } else {
        // Viewing own profile
        userToDisplay = currentUser;
      }
      
      if (userToDisplay) {
        setProfileUser(userToDisplay);
        
        // Load the user's posts
        const userPosts = getPostsByUserId(userToDisplay.id);
        setPosts(userPosts);
        
        // Get follower and following data
        const followersList = getFollowers(userToDisplay.id);
        const followingList = getFollowing(userToDisplay.id);
        
        setFollowers(followersList);
        setFollowing(followingList);
        setFollowersCount(followersList.length);
        setFollowingCount(followingList.length);
      }
      
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, [userId, currentUser, isViewingOtherUser]);

  // Listen for localStorage changes to refresh posts
  useEffect(() => {
    const handleStorageChange = () => {
      if (profileUser) {
        // Refresh posts when storage changes
        const refreshedPosts = getPostsByUserId(profileUser.id);
        setPosts(refreshedPosts);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [profileUser]);

  const handleSaveProfile = (formData: ProfileFormData) => {
    // Save user data to localStorage
    if (profileUser) {
      const updatedUser = updateUser(profileUser.id, {
        name: formData.name,
        email: formData.email,
        batch: formData.batch,
        profileImage: formData.profileImage,
        coverPhoto: formData.coverPhoto,
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

      if (updatedUser) {
        // Trigger localStorage event to update user data across tabs
        window.dispatchEvent(new Event('storage'));
        
        // Update local state
        setProfileUser(updatedUser);
        
        // If this update is for the current user, refresh the page to show changes everywhere
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === updatedUser.id) {
          // Force a refresh of the app state
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'currentUser'
          }));
        }
      }
    }
    setIsEditing(false);
  };
  
  // Handle direct image change from profile header
  const handleImageChange = (type: 'profile' | 'cover', imageData: string) => {
    if (profileUser && currentUser && profileUser.id === currentUser.id) {
      const updatedUser = updateUser(profileUser.id, {
        [type === 'profile' ? 'profileImage' : 'coverPhoto']: imageData
      });
      
      if (updatedUser) {
        setProfileUser(updatedUser);
      }
    }
  };
  
  // Handle follow action
  const handleFollow = () => {
    if (!currentUser || !profileUser) return;
    
    const success = followUser(currentUser.id, profileUser.id);
    if (success) {
      setIsFollowingUser(true);
      // Refresh followers list
      const updatedFollowers = getFollowers(profileUser.id);
      setFollowers(updatedFollowers);
      setFollowersCount(updatedFollowers.length);
    }
  };
  
  // Handle unfollow action
  const handleUnfollow = () => {
    if (!currentUser || !profileUser) return;
    
    const success = unfollowUser(currentUser.id, profileUser.id);
    if (success) {
      setIsFollowingUser(false);
      // Refresh followers list
      const updatedFollowers = getFollowers(profileUser.id);
      setFollowers(updatedFollowers);
      setFollowersCount(updatedFollowers.length);
    }
  };
  
  // Handle user follow actions from the modals
  const handleFollowUser = (targetUserId: string) => {
    if (!currentUser) return;
    
    const success = followUser(currentUser.id, targetUserId);
    if (success && profileUser) {
      // Refresh following list if on current user's profile
      if (profileUser.id === currentUser.id) {
        const updatedFollowing = getFollowing(currentUser.id);
        setFollowing(updatedFollowing);
        setFollowingCount(updatedFollowing.length);
      }
    }
  };
  
  // Handle user unfollow actions from the modals
  const handleUnfollowUser = (targetUserId: string) => {
    if (!currentUser) return;
    
    const success = unfollowUser(currentUser.id, targetUserId);
    if (success && profileUser) {
      // Refresh following list if on current user's profile
      if (profileUser.id === currentUser.id) {
        const updatedFollowing = getFollowing(currentUser.id);
        setFollowing(updatedFollowing);
        setFollowingCount(updatedFollowing.length);
      }
    }
  };
  
  // Handle navigation to a user profile
  const navigateToUserProfile = (userId: string) => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    navigate(`/profile/${userId}`);
  };
  
  // Open followers modal
  const openFollowersModal = () => {
    setShowFollowersModal(true);
  };
  
  // Open following modal
  const openFollowingModal = () => {
    setShowFollowingModal(true);
  };

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <p>User profile not found.</p>
        </div>
      </div>
    );
  }

  const activityStats = {
    posts: posts.length,
    comments: 0,
    events: 0
  };

  // Show edit button only if viewing own profile
  const canEdit = !isViewingOtherUser && currentUser?.id === profileUser.id;
  
  // Get list of current user's following for the modal
  const currentUserFollowing = currentUser?.following || [];

  return (
    <div className="profile-container">
      {isEditing ? (
        <ProfileForm 
          user={profileUser} 
          onSave={handleSaveProfile} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <>
          <ProfileHeader 
            user={profileUser}
            stats={activityStats}
            followersCount={followersCount}
            followingCount={followingCount}
            onFollowersClick={openFollowersModal}
            onFollowingClick={openFollowingModal}
            showEditButton={canEdit}
            onEditClick={() => setIsEditing(true)}
            onImageChange={handleImageChange}
            isFollowing={isFollowingUser}
            onFollowClick={handleFollow}
            onUnfollowClick={handleUnfollow}
            currentUserId={currentUser?.id}
          />
          
          <div className="profile-body">
            <div className="profile-sidebar">
              <ProfileAbout user={profileUser} />
              <ProfileActivity stats={activityStats} />
            </div>
            
            <div className="profile-main">
              <ProfilePosts 
                posts={posts} 
                profileUser={profileUser}
                currentUser={currentUser}
              />
            </div>
          </div>
        </>
      )}
      
      {showFollowersModal && (
        <FollowersModal
          title="Followers"
          users={followers}
          onClose={() => setShowFollowersModal(false)}
          onUserClick={navigateToUserProfile}
          currentUserId={currentUser?.id}
          currentUserFollowing={following.map(user => user.id)}
          onFollow={handleFollowUser}
          onUnfollow={handleUnfollowUser}
        />
      )}
      
      {showFollowingModal && (
        <FollowersModal
          title="Following"
          users={following}
          onClose={() => setShowFollowingModal(false)}
          onUserClick={navigateToUserProfile}
          currentUserId={currentUser?.id}
          currentUserFollowing={following.map(user => user.id)}
          onFollow={handleFollowUser}
          onUnfollow={handleUnfollowUser}
        />
      )}
    </div>
  );
};

export default ProfilePage; 