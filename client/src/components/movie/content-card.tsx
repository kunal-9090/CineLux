import { useState } from 'react';
import { Link } from 'wouter';
import { Play } from 'lucide-react';
import VideoPlayer from './video-player';

interface ContentCardProps {
  id: number;
  title: string;
  posterUrl: string;
  rating?: number;
  year: number;
  progress?: number;
}

const ContentCard = ({ id, title, posterUrl, rating, year, progress }: ContentCardProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      {isVideoOpen && (
        <VideoPlayer 
          isOpen={isVideoOpen} 
          onClose={() => setIsVideoOpen(false)} 
          title={title} 
        />
      )}
      
      <Link href={`/content/${id}`}>
        <div className="content-card relative group rounded-md overflow-hidden transition-transform duration-300 hover:scale-[1.03] cursor-pointer">
          <div className="movie-card-overlay"></div>
          <img 
            src={posterUrl} 
            alt={title} 
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <h3 className="text-sm font-medium truncate">{title}</h3>
            <div className="flex items-center mt-1 space-x-2 text-xs text-[#E5E5E5]">
              {rating && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#D4AF37] mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {rating > 10 ? (rating / 10).toFixed(1) : rating.toFixed(1)}
                </span>
              )}
              <span>{year}</span>
            </div>
          </div>
          
          {progress !== undefined && (
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          
          <button 
            className="play-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsVideoOpen(true);
            }}
            aria-label={`Play ${title}`}
          >
            <Play size={24} fill="white" />
          </button>
        </div>
      </Link>
    </>
  );
};

export default ContentCard;
