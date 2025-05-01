import { useState, useRef } from 'react';
import { User, Post } from '../../../../types';
import { Image, Smile, Send } from 'lucide-react';
import ImagePlaceholder from '../../../../components/ImagePlaceholder';
import './PostForm.css';

interface PostFormProps {
  user: User | null;
  onPostCreated: (post: Post) => void;
}

const PostForm = ({ user, onPostCreated }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !user) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create a new post object
    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userImage: user.profileImage,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    
    // Simulate API delay
    setTimeout(() => {
      onPostCreated(newPost);
      setContent('');
      setIsExpanded(false);
      setIsSubmitting(false);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 500);
  };

  const handleCancel = () => {
    setContent('');
    setIsExpanded(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  if (!user) return null;

  return (
    <div className="post-form-card">
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="post-form-header">
          <div className="user-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name || 'User Avatar'} />
            ) : (
              <ImagePlaceholder
                shape="circle"
                width="40px"
                height="40px"
                color="#fd79a8"
                text={user.name ? user.name.charAt(0) : '?'}
                recommendedSize="100x100px"
              />
            )}
          </div>
          
          <textarea
            ref={textareaRef}
            className="post-input"
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
            onFocus={handleFocus}
            rows={isExpanded ? 3 : 1}
          />
        </div>
        
        {isExpanded && (
          <div className="post-form-footer">
            <div className="post-form-actions">
              <button type="button" className="post-action-btn">
                <Image size={20} />
                <span>Photo</span>
              </button>
              
              <button type="button" className="post-action-btn">
                <Smile size={20} />
                <span>Feeling</span>
              </button>
            </div>
            
            <div className="post-form-submit">
              <button 
                type="button" 
                className="btn btn-outline post-cancel-btn" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="btn btn-primary post-submit-btn"
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  'Posting...'
                ) : (
                  <>
                    <Send size={16} />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm; 