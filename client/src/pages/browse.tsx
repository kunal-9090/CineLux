import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Filter, 
  Grid3X3, 
  List, 
  Loader2 
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ContentCard from '@/components/movie/content-card';
import GenreSelector from '@/components/home/genre-selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Browse = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse URL params
  const initialType = searchParams.get('type') || 'all';
  const initialGenre = searchParams.get('genre') || null;
  const initialSort = searchParams.get('sort') || 'popular';
  
  // State
  const [contentType, setContentType] = useState(initialType);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre);
  const [sortBy, setSortBy] = useState(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (contentType !== 'all') params.set('type', contentType);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (sortBy !== 'popular') params.set('sort', sortBy);
    
    const newUrl = `/browse${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [contentType, selectedGenre, sortBy]);
  
  // Query for content with filters
  const { data: content, isLoading, isFetching } = useQuery({
    queryKey: ['/api/browse', contentType, selectedGenre, sortBy, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (contentType !== 'all') params.set('type', contentType);
      if (selectedGenre) params.set('genre', selectedGenre);
      params.set('sort', sortBy);
      params.set('page', page.toString());
      
      return fetch(`/api/browse?${params.toString()}`)
        .then(res => res.json());
    },
  });
  
  const handleGenreSelect = (genreId: string | null) => {
    setSelectedGenre(genreId);
    setPage(1); // Reset pagination when filter changes
  };
  
  const handleTypeChange = (value: string) => {
    setContentType(value);
    setPage(1); // Reset pagination when filter changes
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset pagination when filter changes
  };
  
  return (
    <div className="min-h-screen bg-[#0A1128]">
      <Navbar />
      
      <main className="pt-20">
        <section className="px-6 md:px-16 py-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Browse Content</h1>
            
            <div className="flex flex-wrap gap-4">
              <Select value={contentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[160px] bg-[#1C2541] border-[#D4AF37]/30 focus:ring-[#D4AF37]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C2541] border-[#D4AF37]/30">
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="movie">Movies</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px] bg-[#1C2541] border-[#D4AF37]/30 focus:ring-[#D4AF37]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C2541] border-[#D4AF37]/30">
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-[#D4AF37]/30 rounded-md overflow-hidden">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#D4AF37] text-[#0A1128]' : 'bg-[#1C2541] text-[#E5E5E5]'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#D4AF37] text-[#0A1128]' : 'bg-[#1C2541] text-[#E5E5E5]'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <GenreSelector onSelectGenre={handleGenreSelect} />
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37]" />
              </div>
            ) : content?.items?.length > 0 ? (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                  : 'space-y-4'
                }>
                  {content.items.map((item: any) => (
                    viewMode === 'grid' ? (
                      <ContentCard 
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        posterUrl={item.posterUrl}
                        rating={item.rating}
                        year={item.year}
                        progress={item.progress}
                      />
                    ) : (
                      <div key={item.id} className="flex bg-[#1C2541] rounded-md overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-colors">
                        <img 
                          src={item.posterUrl} 
                          alt={item.title}
                          className="w-24 sm:w-36 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <h3 className="font-bold">{item.title}</h3>
                          <div className="flex items-center mt-1 mb-2">
                            <span className="text-[#D4AF37] flex items-center mr-3">
                              <Star size={14} className="mr-1" />
                              {item.rating?.toFixed(1)}
                            </span>
                            <span className="text-[#E5E5E5] mr-3">{item.year}</span>
                            {item.runtime && (
                              <span className="text-[#E5E5E5]">{formatRuntime(item.runtime)}</span>
                            )}
                          </div>
                          <p className="text-[#E5E5E5] text-sm line-clamp-2">{item.description}</p>
                          
                          <div className="mt-3 flex">
                            <button className="bg-[#DC143C] hover:bg-[#DC143C]/90 text-white px-3 py-1 rounded text-sm flex items-center">
                              <Play size={14} className="mr-1" /> Watch
                            </button>
                            <button className="ml-2 border border-[#D4AF37]/50 text-white px-3 py-1 rounded text-sm hover:bg-[#D4AF37]/10 transition-colors">
                              <Plus size={14} className="mr-1" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 rounded-md bg-[#1C2541] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1 || isFetching}
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-[#D4AF37] text-[#0A1128] rounded-md font-medium">
                      {page}
                    </span>
                    <button
                      className="px-4 py-2 rounded-md bg-[#1C2541] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={!content.hasMore || isFetching}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Filter size={48} className="mx-auto text-[#D4AF37] mb-4" />
                <h3 className="text-xl font-medium mb-2">No content found</h3>
                <p className="text-[#E5E5E5]">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;
