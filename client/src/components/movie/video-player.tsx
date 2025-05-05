import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const VideoPlayer = ({ isOpen, onClose, title }: VideoPlayerProps) => {
  const [hasStarted, setHasStarted] = useState(false);

  // Close video player when Escape key is pressed
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-play the video
      setHasStarted(true);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full max-w-6xl mx-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        
        <div className="relative w-full aspect-video">
          {hasStarted ? (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0A1128]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-[#0A1128] text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-[#E5E5E5] text-sm mt-2">Now playing demo content</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;