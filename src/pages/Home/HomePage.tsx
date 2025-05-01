import { useState, useEffect } from 'react';
import { User, Post } from '../../types';
import PostForm from './components/PostForm/PostForm';
import PostList from './components/PostList/PostList';
import SidebarLeft from './components/Sidebar/SidebarLeft';
import SidebarRight from './components/Sidebar/SidebarRight';
import { MessageSquare, RefreshCw, Zap } from 'lucide-react';
import './Home.css';

interface HomePageProps {
  user: User | null;
}

const HomePage = ({ user }: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedView, setFeedView] = useState<'all' | 'following'>('all');
  
  // Simulate loading state on initial load
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleAddComment = (postId: string, comment: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );
  };
  
  const handleRefreshFeed = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  const toggleFeedView = (view: 'all' | 'following') => {
    setFeedView(view);
  };
  
  const focusPostInput = () => {
    const postInput = document.querySelector('.post-input') as HTMLTextAreaElement;
    if (postInput) {
      postInput.focus();
    }
  };

  return (
    <div className="home-page">
      <div className="home-layout">
        <div className="sidebar-left">
          <SidebarLeft user={user} />
        </div>
        
        <div className="main-content">
          <div className="feed-header">
            <div className="feed-tabs">
              <button 
                className={`feed-tab ${feedView === 'all' ? 'active' : ''}`}
                onClick={() => toggleFeedView('all')}
              >
                <Zap size={18} />
                All Posts
              </button>
              <button 
                className={`feed-tab ${feedView === 'following' ? 'active' : ''}`}
                onClick={() => toggleFeedView('following')}
              >
                <MessageSquare size={18} />
                Following
              </button>
            </div>
            <button className="refresh-button" onClick={handleRefreshFeed} disabled={isLoading}>
              <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
            </button>
          </div>
          
          <PostForm onPostCreated={handleCreatePost} user={user} />
          
          {isLoading ? (
            <div className="loading-posts">
              <div className="post-skeleton"></div>
              <div className="post-skeleton"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <MessageSquare size={48} />
              <h3>No posts yet</h3>
              <p>Be the first to share something with your alumni network!</p>
              <button 
                className="btn btn-primary create-first-post-btn"
                onClick={focusPostInput}
              >
                Create your first post
              </button>
            </div>
          ) : (
            <PostList 
              posts={posts} 
              onLikePost={handleLikePost} 
              onAddComment={handleAddComment} 
            />
          )}
        </div>
        
        <div className="sidebar-right">
          <SidebarRight />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 