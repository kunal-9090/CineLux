import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import ContentCard from '@/components/movie/content-card';

interface ContentRowProps {
  title: string;
  endpoint: string;
  viewAllLink?: string;
}

const ContentRow = ({ title, endpoint, viewAllLink }: ContentRowProps) => {
  const { data: content, isLoading } = useQuery({
    queryKey: [endpoint],
  });

  return (
    <section className="px-6 md:px-16 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <button className="flex items-center text-sm text-[#D4AF37] hover:text-[#F2CA52] transition-colors">
              View All <ChevronRight size={16} />
            </button>
          </Link>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#1C2541] rounded-md aspect-[2/3] animate-pulse"></div>
          ))}
        </div>
      ) : content?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {content.map((item: any) => (
            <ContentCard 
              key={item.id}
              id={item.id}
              title={item.title}
              posterUrl={item.posterUrl}
              rating={item.rating}
              year={item.year}
              progress={item.progress}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#E5E5E5]">
          No content available at the moment.
        </div>
      )}
    </section>
  );
};

export default ContentRow;
