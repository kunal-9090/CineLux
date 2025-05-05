import { useQuery } from '@tanstack/react-query';
import { Star, Crown } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface LeaderboardRowProps {
  rank: number;
  username: string;
  points: number;
  isUser: boolean;
}

const LeaderboardRow = ({ rank, username, points, isUser }: LeaderboardRowProps) => {
  return (
    <div className={`px-6 py-4 flex items-center border-b border-[#D4AF37]/10 ${isUser ? 'bg-[#D4AF37]/10' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        rank <= 3 
          ? 'bg-[#D4AF37] text-[#0A1128]' 
          : 'bg-[#0A1128] border border-[#D4AF37]/50 text-[#E5E5E5]'
      }`}>
        <span className="font-bold text-sm">{rank}</span>
      </div>
      <div className="ml-4 flex-1">
        <span className={`font-medium ${isUser ? 'text-[#D4AF37]' : ''}`}>{username}</span>
      </div>
      <div className="flex items-center">
        <Star size={14} className="text-[#D4AF37] mr-1.5" />
        <span className="font-medium">{formatNumber(points)}</span>
      </div>
    </div>
  );
};

const LeaderboardSection = () => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['/api/leaderboard'],
  });
  
  return (
    <section className="px-6 md:px-16 py-12">
      <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
        <Crown size={24} className="text-[#D4AF37] mr-2" />
        Weekly Leaderboard
      </h2>
      
      <div className="bg-[#1C2541] rounded-lg overflow-hidden shadow-lg border border-[#D4AF37]/20">
        <div className="px-6 py-4 bg-[#0A1128] border-b border-[#D4AF37]/30 flex justify-between items-center">
          <span className="font-medium">Top Viewers This Week</span>
          <span className="text-sm text-[#D4AF37]">Resets in 3 days</span>
        </div>
        
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : (
          <>
            {leaderboardData?.map((user: any, index: number) => (
              <LeaderboardRow
                key={user.id}
                rank={index + 1}
                username={user.username}
                points={user.points}
                isUser={user.isCurrentUser}
              />
            ))}
            
            <div className="px-6 py-4 flex justify-center">
              <button className="text-[#D4AF37] hover:text-[#F2CA52] transition-colors flex items-center">
                See Full Leaderboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LeaderboardSection;
