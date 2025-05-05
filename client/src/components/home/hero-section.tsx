import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Play, Star, ChevronDown } from 'lucide-react';
import { formatRuntime, getPointsForContent } from '@/lib/utils';
import VideoPlayer from '@/components/movie/video-player';

const HeroSection = () => {
  const { data: featuredMovie } = useQuery({
    queryKey: ['/api/movies/featured'],
  });

  const [isVisible, setIsVisible] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!featuredMovie) {
    return (
      <div className="relative h-96 bg-[#0A1128] flex items-center justify-center">
        <div className="text-[#E5E5E5]">Loading featured content...</div>
      </div>
    );
  }

  const { 
    id, 
    title, 
    description, 
    backdropUrl, 
    rating, 
    year, 
    runtime, 
    features = ['4K Ultra HD', 'Exclusive Content', 'Weekly Rewards']
  } = featuredMovie;

  const points = getPointsForContent(runtime);

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {isVideoOpen && (
        <VideoPlayer 
          isOpen={isVideoOpen} 
          onClose={() => setIsVideoOpen(false)} 
          title={title} 
        />
      )}
      {/* Background with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/70 to-transparent z-10"></div>
      <img 
        src={backdropUrl} 
        alt={`${title} backdrop`} 
        className="w-full h-full object-cover"
      />
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-wide">{title}</h1>
        <p className="text-[#E5E5E5] max-w-lg mb-6 md:text-lg">{description}</p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap space-x-0 space-y-3 sm:space-x-4 sm:space-y-0">
          <button 
            className="bg-[#DC143C] hover:bg-[#DC143C]/90 text-white px-6 py-3 rounded-md flex items-center transition-all shadow-lg hover:shadow-xl border border-transparent hover:border-[#D4AF37]/50 w-full sm:w-auto"
            onClick={() => setIsVideoOpen(true)}
            aria-label="Watch Now"
          >
            <Play size={20} className="mr-2" /> Watch Now
          </button>
          <Link href={`/content/${id}`} className="bg-transparent hover:bg-[#D4AF37]/10 text-white px-6 py-3 border border-[#D4AF37] rounded-md flex items-center transition-all w-full sm:w-auto">
            <Star size={20} className="mr-2 text-[#D4AF37]" /> Details
          </Link>
          <button 
            className="bg-transparent border border-[#D4AF37] text-white px-6 py-3 rounded-md hover:bg-[#D4AF37]/10 transition-all w-full sm:w-auto"
            onClick={() => {
              // In a real implementation, this would add to user watchlist
              console.log(`Add movie ${id} to watchlist`);
            }}
          >
            Add to Watchlist
          </button>
        </div>
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center mt-6 space-x-0 sm:space-x-4 text-sm">
          <span className="flex items-center mb-2 sm:mb-0 mr-4 sm:mr-0">
            <Star size={16} className="text-[#D4AF37] mr-1" />
            <span>{rating ? (rating > 10 ? (rating / 10).toFixed(1) : rating.toFixed(1)) : "N/A"}</span>
          </span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#E5E5E5]"></span>
          <span className="mb-2 sm:mb-0 mr-4 sm:mr-0">{year}</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#E5E5E5]"></span>
          <span className="mb-2 sm:mb-0 mr-4 sm:mr-0">{formatRuntime(runtime)}</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-[#E5E5E5]"></span>
          <span className="text-[#D4AF37] mb-2 sm:mb-0">+{points} points</span>
        </div>
        
        {/* Feature Tags */}
        <div className="hidden md:flex items-center mt-8 space-x-6">
          {features.map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      {isVisible && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center bounce-animation z-20">
          <ChevronDown size={24} className="text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-widest mt-2 text-[#E5E5E5]">Explore Library</span>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
