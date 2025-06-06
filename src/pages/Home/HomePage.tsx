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
} from '../../services/firebase/postService';
import { getCurrentUser } from '../../services/firebase/userService';

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
    const init = async () => {
      try {
        await initializePostData();
        await loadPosts();
      } catch (error) {
        console.error('Error initializing posts:', error);
      }
    };
    
    init();
  }, []);
  
  // Update local user state when props change
  useEffect(() => {
    if (user) {
      // Ensure the user object matches the expected type
      setCurrentUser(user as User);
    }
  }, [user]);
  
  // Listen for storage events to update user data when it changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser') {
        const updatedUser = getCurrentUser();
        if (updatedUser) {
          // Ensure the user object matches the expected type
          setCurrentUser(updatedUser as unknown as User);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    
    try {
      const allPosts = await getAllPosts();
      // Sort by most recent
      const sortedPosts = [...allPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLikePost = async (postId: string) => {
    if (!currentUser) return; // Ensure user is logged in
    
    try {
      const updatedPost = await likePost(postId, currentUser.id); // Pass user.id
      if (updatedPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId: string, comment: any) => {
    try {
      const updatedPost = await addComment(postId, comment);
      if (updatedPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  // Add handler for adding a reply to a comment
  const handleAddReply = async (postId: string, commentId: string, reply: any) => {
    try {
      const updatedPost = await addReplyToComment(postId, commentId, reply);
      if (updatedPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  // Add handler for toggling a reaction on a comment
  const handleCommentReaction = async (postId: string, commentId: string) => {
    if (!currentUser) return;
    
    try {
      const updatedPost = await toggleCommentReaction(postId, commentId, currentUser.id, currentUser.name);
      if (updatedPost) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? updatedPost : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling comment reaction:', error);
    }
  };
  
  const handleRefreshFeed = () => {
    loadPosts();
  };
  
  const toggleFeedView = async (view: 'all' | 'following') => {
    setFeedView(view);
    setIsLoading(true);
    
    try {
      const allPosts = await getAllPosts();
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
    } catch (error) {
      console.error('Error toggling feed view:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const focusPostInput = () => {
    const postInput = document.querySelector('.post-input') as HTMLTextAreaElement;
    if (postInput) {
      postInput.focus();
    }
  };

  // Add handler for deleting posts
  const handleDeletePost = async (postId: string) => {
    try {
      // Delete the post from Firebase
      const success = await deletePost(postId);
      
      if (success) {
        // Remove the post from state
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
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
