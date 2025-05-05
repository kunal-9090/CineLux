import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface GenreSelectorProps {
  onSelectGenre: (genreId: string | null) => void;
}

const GenreSelector = ({ onSelectGenre }: GenreSelectorProps) => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const { data: genres } = useQuery({
    queryKey: ['/api/genres'],
  });
  
  const handleGenreClick = (genreId: string | null) => {
    setSelectedGenre(genreId);
    onSelectGenre(genreId);
  };
  
  return (
    <section className="px-6 md:px-16 py-6">
      <div className="overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex space-x-3 min-w-max">
          <button 
            className={`px-5 py-2 rounded-full font-medium text-sm transition-transform hover:scale-105 ${
              selectedGenre === null 
                ? 'bg-[#D4AF37] text-[#0A1128]' 
                : 'bg-[#1C2541] text-[#E5E5E5] hover:text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
            }`}
            onClick={() => handleGenreClick(null)}
          >
            All
          </button>
          
          {genres?.map((genre: any) => (
            <button 
              key={genre.id}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                selectedGenre === genre.id 
                  ? 'bg-[#D4AF37] text-[#0A1128]' 
                  : 'bg-[#1C2541] text-[#E5E5E5] hover:text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
              onClick={() => handleGenreClick(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreSelector;
