import { Post, Comment } from '../../../../types';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Heart, Send } from 'lucide-react';
import { useState } from 'react';
import ImagePlaceholder from '../../../../components/ImagePlaceholder';
import './PostList.css';

interface PostListProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
}

const PostList = ({ posts, onLikePost, onAddComment }: PostListProps) => {
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Format date to a friendly format
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleToggleComments = (postId: string) => {
    setExpandedCommentPostId(prev => prev === postId ? null : postId);
  };

  const handleCommentChange = (postId: string, text: string) => {
    setCommentTexts(prev => ({ ...prev, [postId]: text }));
  };

  const handleSubmitComment = (postId: string) => {
    if (!commentTexts[postId] || !commentTexts[postId].trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: 'You',
      userImage: '',
      content: commentTexts[postId].trim(),
      createdAt: new Date(),
    };
    
    onAddComment(postId, newComment);
    setCommentTexts(prev => ({ ...prev, [postId]: '' }));
  };
  
  const handleLike = (postId: string) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    onLikePost(postId);
  };

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts to display yet.</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="post-avatar">
                  {post.userImage ? (
                    <img src={post.userImage} alt={post.userName} />
                  ) : (
                    <ImagePlaceholder
                      shape="circle"
                      width="45px"
                      height="45px"
                      color="#6c5ce7"
                      text={post.userName.charAt(0)}
                      recommendedSize="100x100px"
                    />
                  )}
                </div>
                <div className="post-info">
                  <h3 className="post-author-name">{post.userName}</h3>
                  <p className="post-time">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              <button className="post-menu-button">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
              
              {post.images && post.images.length > 0 ? (
                <div className="post-images">
                  {post.images.map((image, index) => (
                    <img key={index} src={image} alt={`${post.userName}'s post image ${index + 1}`} />
                  ))}
                </div>
              ) : post.content.includes('image') && (
                <ImagePlaceholder
                  shape="rectangle"
                  height="200px"
                  color="#2ecc71"
                  recommendedSize="1200x630px"
                />
              )}
            </div>
            
            <div className="post-stats">
              <div className="post-likes">
                {post.likes > 0 && (
                  <>
                    <div className="like-icon-container">
                      <Heart size={14} fill={likedPosts[post.id] ? "#ec4899" : "none"} stroke={likedPosts[post.id] ? "#ec4899" : "currentColor"} />
                    </div>
                    <span className="post-likes-count">{post.likes}</span>
                  </>
                )}
              </div>
              <div className="post-comments-count">
                {post.comments.length > 0 && (
                  <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                )}
              </div>
            </div>
            
            <div className="post-actions">
              <button
                className={`post-action ${likedPosts[post.id] ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart
                  size={18}
                  fill={likedPosts[post.id] ? "#ec4899" : "none"}
                  stroke={likedPosts[post.id] ? "#ec4899" : "currentColor"}
                />
                <span>{likedPosts[post.id] ? 'Liked' : 'Like'}</span>
              </button>
              <button
                className="post-action"
                onClick={() => handleToggleComments(post.id)}
              >
                <MessageCircle size={18} />
                <span>Comment</span>
              </button>
              <button className="post-action">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
            
            {(expandedCommentPostId === post.id || post.comments.length > 0) && (
              <div className="post-comments">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-avatar">
                      {comment.userImage ? (
                        <img src={comment.userImage} alt={comment.userName} />
                      ) : (
                        <ImagePlaceholder
                          shape="circle"
                          width="36px"
                          height="36px"
                          color="#e84393"
                          text={comment.userName.charAt(0)}
                          recommendedSize="60x60px"
                        />
                      )}
                    </div>
                    <div className="comment-content">
                      <div className="comment-bubble">
                        <h4 className="comment-author">{comment.userName}</h4>
                        <p className="comment-text">{comment.content}</p>
                      </div>
                      <div className="comment-actions">
                        <button className="comment-action">Like</button>
                        <button className="comment-action">Reply</button>
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {expandedCommentPostId === post.id && (
                  <div className="comment-form">
                    <div className="comment-avatar">
                      <ImagePlaceholder
                        shape="circle"
                        width="36px"
                        height="36px"
                        color="#0984e3"
                        text="Y"
                        recommendedSize="60x60px"
                      />
                    </div>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={commentTexts[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmitComment(post.id);
                          }
                        }}
                      />
                      <button 
                        className="comment-submit"
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!commentTexts[post.id] || !commentTexts[post.id].trim()}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostList; 