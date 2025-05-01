import { MessageSquare, Heart, Clock, FilePenLine } from 'lucide-react';
import './styles.css';

interface Post {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
}

interface ProfilePostsProps {
  posts: Post[];
}

const ProfilePosts = ({ posts }: ProfilePostsProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="profile-posts">
      <div className="posts-header">
        <h2>My Posts</h2>
      </div>
      
      <div className="posts-content">
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-footer">
                  <div className="post-date">
                    <Clock size={14} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="post-metrics">
                    <div className="post-metric likes">
                      <Heart size={14} />
                      <span>{post.likes}</span>
                    </div>
                    <div className="post-metric comments">
                      <MessageSquare size={14} />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-posts">
            <div className="empty-icon">
              <FilePenLine size={48} strokeWidth={1.5}/>
            </div>
            <h3>No posts yet</h3>
            <p>You haven't created any posts yet. Start sharing with your alumni community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts; 