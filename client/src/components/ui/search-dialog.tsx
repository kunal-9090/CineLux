import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', debouncedQuery],
    queryFn: () => {
      return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then(res => res.json());
    },
    enabled: debouncedQuery.length > 2
  });
  
  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [open]);
  
  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 100);
    }
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#1C2541] border-[#D4AF37]/30 p-0">
        <div className="flex items-center border-b border-[#D4AF37]/20 p-4">
          <Search className="h-5 w-5 text-[#D4AF37] mr-2" />
          <Input
            id="search-input"
            placeholder="Search movies, series..."
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-[#E5E5E5]/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setSearchQuery('')}
            className={`text-[#E5E5E5] hover:text-white transition-colors ${!searchQuery ? 'hidden' : ''}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading && debouncedQuery.length > 2 && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
            </div>
          )}
          
          {!isLoading && debouncedQuery.length > 2 && searchResults?.length === 0 && (
            <div className="text-center py-8 text-[#E5E5E5]">
              No results found for "{debouncedQuery}"
            </div>
          )}
          
          {!isLoading && searchResults?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {searchResults.map((item: any) => (
                <Link 
                  key={item.id}
                  href={`/movie/${item.id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <div className="relative rounded overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                    <img 
                      src={item.posterUrl} 
                      alt={item.title} 
                      className="w-full aspect-[2/3] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-sm font-medium truncate">{item.title}</h3>
                      <div className="flex items-center mt-1 space-x-2 text-xs text-[#E5E5E5]">
                        <span>{item.year}</span>
                        {item.rating && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#E5E5E5]"></span>
                            <span className="flex items-center">
                              <svg className="h-3 w-3 text-[#D4AF37] mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {item.rating}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {debouncedQuery.length <= 2 && (
            <div className="text-center py-8 text-[#E5E5E5]">
              Start typing to search for movies and series
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
