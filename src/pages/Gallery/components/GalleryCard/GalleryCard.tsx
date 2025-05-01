import { Heart, Bookmark, Calendar } from 'lucide-react';
import { useState } from 'react';
import './GalleryCard.css';

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  album: string;
  likes: number;
}

interface GalleryCardProps {
  image: GalleryImage;
}

const GalleryCard = ({ image }: GalleryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div 
      className="gallery-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="gallery-card-image">
        <img src={image.url} alt={image.title} />
        <div className={`image-overlay ${isHovered ? 'visible' : ''}`}>
          <div className="overlay-actions">
            <button 
              className={`overlay-btn ${liked ? 'active' : ''}`}
              onClick={handleLike}
              aria-label="Like image"
            >
              <Heart size={18} />
            </button>
            <button 
              className={`overlay-btn ${bookmarked ? 'active' : ''}`}
              onClick={handleBookmark}
              aria-label="Bookmark image"
            >
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="gallery-card-info">
        <h3>{image.title}</h3>
        <div className="gallery-card-meta">
          <span className="album-tag">{image.album}</span>
          <span className="date-info">
            <Calendar size={14} />
            {new Date(image.date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard; 