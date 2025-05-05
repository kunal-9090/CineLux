import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'wouter';
import { 
  Play, 
  Star, 
  Plus, 
  Award,
  Clock,
  Tag,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ContentRow from '@/components/home/content-row';
import { formatRuntime, getPointsForContent } from '@/lib/utils';
import VideoPlayer from '@/components/movie/video-player';

const Movie = () => {
  const { id } = useParams();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const { data: movie, isLoading, error } = useQuery<any>({
    queryKey: [`/api/movies/${id}`],
    enabled: !!id,
  });
  
  // Scroll to top when movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1128]">
        <Navbar />
        <div className="pt-20 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#0A1128]">
        <Navbar />
        <div className="pt-20 flex flex-col justify-center items-center h-96">
          <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
          <p className="text-[#E5E5E5] mb-8">Sorry, we couldn't find the content you're looking for.</p>
          <Link href="/browse">
            <span className="bg-[#D4AF37] text-[#0A1128] px-6 py-3 rounded-md hover:bg-[#D4AF37]/90 transition-all">
              Browse Content
            </span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const { 
    title,
    description,
    backdropUrl,
    posterUrl,
    rating,
    year,
    runtime,
    genres,
    director,
    cast,
    points = getPointsForContent(runtime),
  } = movie;
  
  return (
    <div className="min-h-screen bg-[#0A1128]">
      {isVideoOpen && (
        <VideoPlayer 
          isOpen={isVideoOpen} 
          onClose={() => setIsVideoOpen(false)} 
          title={title} 
        />
      )}
      <Navbar />
      
      <main className="pt-16 md:pt-20">
        {/* Hero Section with Backdrop */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/70 to-transparent z-10"></div>
          <img 
            src={backdropUrl} 
            alt={`${title} backdrop`} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Poster (Mobile: Hidden, Desktop: Visible) */}
              <div className="hidden md:block w-64 flex-shrink-0">
                <img 
                  src={posterUrl} 
                  alt={`${title} poster`} 
                  className="w-full rounded-md shadow-lg border border-[#D4AF37]/20" 
                />
              </div>
              
              {/* Movie Details */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                
                <div className="flex flex-wrap items-center mt-3 mb-6 space-x-0 sm:space-x-4 text-sm">
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
                
                <p className="text-[#E5E5E5] max-w-2xl md:text-lg">{description}</p>
                
                <div className="flex flex-wrap mt-8 gap-3">
                  {genres?.map((genre: string, index: number) => (
                    <Link key={index} href={`/browse?genre=${genre}`}>
                      <span className="feature-tag cursor-pointer">
                        {genre}
                      </span>
                    </Link>
                  ))}
                </div>
                
                <div className="flex flex-wrap space-x-0 space-y-3 sm:space-x-4 sm:space-y-0 mt-8">
                  <button 
                    className="bg-[#DC143C] hover:bg-[#DC143C]/90 text-white px-6 py-3 rounded-md flex items-center transition-all shadow-lg hover:shadow-xl border border-transparent hover:border-[#D4AF37]/50 w-full sm:w-auto"
                    onClick={() => setIsVideoOpen(true)}
                    aria-label="Watch Now"
                  >
                    <Play size={20} className="mr-2" /> Watch Now
                  </button>
                  <button className="bg-transparent border border-[#D4AF37] text-white px-6 py-3 rounded-md hover:bg-[#D4AF37]/10 transition-all w-full sm:w-auto flex items-center justify-center">
                    <Plus size={20} className="mr-2" /> Add to Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Movie Details Tabs */}
        <section className="px-6 md:px-16 py-10">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="bg-[#1C2541] border border-[#D4AF37]/20">
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="cast"
                className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
              >
                Cast & Crew
              </TabsTrigger>
              <TabsTrigger 
                value="related"
                className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
              >
                Related
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-2">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Tag size={20} className="mr-2 text-[#D4AF37]" />
                    Synopsis
                  </h3>
                  <p className="text-[#E5E5E5] leading-relaxed">
                    {description}
                  </p>
                  
                  <h3 className="text-xl font-bold mt-8 mb-4 flex items-center">
                    <Award size={20} className="mr-2 text-[#D4AF37]" />
                    Awards & Recognition
                  </h3>
                  <p className="text-[#E5E5E5] leading-relaxed">
                    This film has won numerous awards including Best Picture, Best Director, and Best Cinematography at various film festivals and award ceremonies.
                  </p>
                </div>
                
                <div className="bg-[#1C2541] p-6 rounded-lg border border-[#D4AF37]/20">
                  <h3 className="text-lg font-bold mb-4">Content Info</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#D4AF37] text-sm">Director</h4>
                      <p className="text-[#E5E5E5]">{director}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[#D4AF37] text-sm">Release Date</h4>
                      <p className="text-[#E5E5E5]">{year}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[#D4AF37] text-sm">Runtime</h4>
                      <p className="text-[#E5E5E5]">{formatRuntime(runtime)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-[#D4AF37] text-sm">Genre</h4>
                      <p className="text-[#E5E5E5]">{genres?.join(', ')}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-[#D4AF37]/20">
                      <h4 className="text-[#D4AF37] text-sm flex items-center">
                        <Star size={14} className="mr-1" /> Points Earned
                      </h4>
                      <p className="text-[#E5E5E5]">{points} reward points</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cast" className="mt-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <User size={20} className="mr-2 text-[#D4AF37]" />
                Cast Members
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cast?.map((person: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-full aspect-square rounded-full overflow-hidden mb-2 border-2 border-[#D4AF37]/40">
                      <img 
                        src={person.photoUrl} 
                        alt={person.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium">{person.name}</h4>
                    <p className="text-sm text-[#E5E5E5]">{person.character}</p>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mt-12 mb-6 flex items-center">
                <User size={20} className="mr-2 text-[#D4AF37]" />
                Crew
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4">
                <div>
                  <h4 className="text-[#D4AF37]">Director</h4>
                  <p>{director}</p>
                </div>
                <div>
                  <h4 className="text-[#D4AF37]">Producer</h4>
                  <p>Emma Thomas</p>
                </div>
                <div>
                  <h4 className="text-[#D4AF37]">Cinematographer</h4>
                  <p>Hoyte van Hoytema</p>
                </div>
                <div>
                  <h4 className="text-[#D4AF37]">Music</h4>
                  <p>Hans Zimmer</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="related" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Similar Content</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {/* Content will be loaded from API */}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Related Content */}
        <ContentRow 
          title="You May Also Like" 
          endpoint={`/api/movies/recommended/${id}`}
          viewAllLink="/browse"
        />
        
      </main>
      
      <Footer />
    </div>
  );
};

export default Movie;
