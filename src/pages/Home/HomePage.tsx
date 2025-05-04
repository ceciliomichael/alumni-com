import { useState, useEffect } from 'react';
import { User, Post, Comment, Reply } from '../../types';
import PostForm from './components/PostForm/PostForm';
import PostList from './components/PostList/PostList';
import SidebarLeft from './components/Sidebar/SidebarLeft';
import SidebarRight from './components/Sidebar/SidebarRight';
import { MessageSquare, RefreshCw, Zap } from 'lucide-react';
import './Home.css';
import { 
  getAllPosts, 
  likePost, 
  addComment, 
  initializePostData,
  addReplyToComment,
  toggleCommentReaction,
  deletePost
} from '../Admin/services/localStorage/postService';
import { getCurrentUser } from '../Admin/services/localStorage/userService';

interface HomePageProps {
  user: User | null;
}

const HomePage = ({ user }: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedView, setFeedView] = useState<'all' | 'following'>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(user);
  
  // Load posts on component mount
  useEffect(() => {
    initializePostData();
    loadPosts();
  }, []);
  
  // Update local user state when props change
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
  
  // Listen for storage events to update user data when it changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        const updatedUser = getCurrentUser();
        if (updatedUser) {
          setCurrentUser(updatedUser);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadPosts = () => {
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const allPosts = getAllPosts();
      // Sort by most recent
      const sortedPosts = [...allPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(sortedPosts);
      setIsLoading(false);
    }, 800);
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return; // Ensure user is logged in
    const updatedPost = likePost(postId, currentUser.id); // Pass user.id
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      );
    }
  };

  const handleAddComment = (postId: string, comment: any) => {
    const updatedPost = addComment(postId, comment);
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      );
    }
  };
  
  // Add handler for adding a reply to a comment
  const handleAddReply = (postId: string, commentId: string, reply: any) => {
    const updatedPost = addReplyToComment(postId, commentId, reply);
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      );
    }
  };

  // Add handler for toggling a reaction on a comment
  const handleCommentReaction = (postId: string, commentId: string) => {
    if (!currentUser) return;
    
    const updatedPost = toggleCommentReaction(postId, commentId, currentUser.id, currentUser.name);
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      );
    }
  };
  
  const handleRefreshFeed = () => {
    loadPosts();
  };
  
  const toggleFeedView = (view: 'all' | 'following') => {
    setFeedView(view);
    setIsLoading(true);
    
    setTimeout(() => {
      const allPosts = getAllPosts();
      let filteredPosts = [...allPosts];
      
      if (view === 'following' && currentUser) {
        // In a real app, you would filter by followed users
        // For now, just show a subset
        filteredPosts = filteredPosts.filter((_, index) => index % 2 === 0);
      }
      
      // Sort by most recent
      filteredPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(filteredPosts);
      setIsLoading(false);
    }, 500);
  };
  
  const focusPostInput = () => {
    const postInput = document.querySelector('.post-input') as HTMLTextAreaElement;
    if (postInput) {
      postInput.focus();
    }
  };

  // Add handler for deleting posts
  const handleDeletePost = (postId: string) => {
    // Remove the post from state
    setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <div className="home-page">
      <div className="home-layout">
        <div className="sidebar-left">
          <SidebarLeft user={currentUser} />
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
          
          <PostForm onPostCreated={handleCreatePost} user={currentUser} />
          
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
              userId={currentUser?.id || null}
              onLikePost={handleLikePost} 
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onToggleCommentReaction={handleCommentReaction}
              onDeletePost={handleDeletePost}
              currentUser={currentUser}
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