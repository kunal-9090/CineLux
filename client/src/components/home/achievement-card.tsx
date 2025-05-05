import { Award, Star, Crown } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  progress: number;
  points: number;
  completed?: boolean;
  icon: 'award' | 'star' | 'crown';
}

const AchievementCard = ({ 
  title, 
  description, 
  progress, 
  points, 
  completed = false,
  icon
}: AchievementCardProps) => {
  
  const renderIcon = () => {
    switch (icon) {
      case 'award':
        return <Award size={24} />;
      case 'star':
        return <Star size={24} />;
      case 'crown':
        return <Crown size={24} />;
      default:
        return <Award size={24} />;
    }
  };
  
  return (
    <div className={`bg-[#1C2541] rounded-lg p-5 border transition-transform hover:scale-[1.02] ${
      completed ? 'border-[#D4AF37] pulse-animation' : 'border-[#D4AF37]/20'
    }`}>
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          completed 
            ? 'bg-[#D4AF37]' 
            : 'bg-[#0A1128] border border-[#D4AF37]'
        }`}>
          <div className={completed ? 'text-[#0A1128]' : 'text-[#D4AF37]'}>
            {renderIcon()}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-[#E5E5E5] text-sm mt-1">{description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span>{progress}% Complete</span>
              <span className="text-[#D4AF37]">{points} points</span>
            </div>
            <div className="h-2 bg-[#0A1128] rounded-full overflow-hidden">
              <div 
                className={`h-full ${completed ? 'bg-[#D4AF37]' : 'bg-[#DC143C]'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {completed && (
            <button className="mt-4 w-full py-2 bg-[#1C2541] border border-[#D4AF37]/50 text-[#D4AF37] text-sm rounded hover:bg-[#D4AF37]/10 transition-colors">
              Claim Reward
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
