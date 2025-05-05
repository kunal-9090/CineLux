import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Award, 
  Trophy, 
  Gift, 
  Star, 
  ChevronRight, 
  Clock,
  Gift as GiftIcon
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import AchievementCard from '@/components/home/achievement-card';
import LeaderboardSection from '@/components/home/leaderboard-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/utils';

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  
  const { data: achievementsData } = useQuery({
    queryKey: ['/api/achievements'],
  });
  
  const { data: rewardsData } = useQuery({
    queryKey: ['/api/rewards'],
  });
  
  const { data: userPoints } = useQuery({
    queryKey: ['/api/users/points'],
  });
  
  const totalPoints = userPoints?.total || 2450;
  
  return (
    <div className="min-h-screen bg-[#0A1128]">
      <Navbar />
      
      <main className="pt-20">
        <section className="px-6 md:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* User Stats Panel */}
            <div className="lg:w-1/3">
              <div className="bg-[#1C2541] rounded-lg border border-[#D4AF37]/20 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Star size={24} className="text-[#D4AF37] mr-2" />
                  Your Rewards Status
                </h2>
                
                <div className="p-4 bg-[#0A1128] rounded-lg border border-[#D4AF37]/30 mb-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Available Points</h3>
                    <div className="text-2xl font-bold text-[#D4AF37]">{formatNumber(totalPoints)}</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="flex items-center mb-3 font-medium">
                    <Trophy size={18} className="text-[#D4AF37] mr-2" />
                    Current Tier: <span className="ml-2 text-[#D4AF37]">Premium</span>
                  </h3>
                  
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress to Elite Tier</span>
                    <span>5,000 / 10,000 points</span>
                  </div>
                  <Progress value={50} className="h-2 bg-[#0A1128]" indicatorClassName="bg-[#D4AF37]" />
                  
                  <div className="mt-4 text-sm text-[#E5E5E5]">
                    Earn 5,000 more points to unlock Elite tier benefits!
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="flex items-center mb-3 font-medium">
                    <Clock size={18} className="text-[#D4AF37] mr-2" />
                    Weekly Challenge
                  </h3>
                  
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Watch 5 different genres</span>
                    <span>3 / 5 completed</span>
                  </div>
                  <Progress value={60} className="h-2 bg-[#0A1128]" indicatorClassName="bg-[#DC143C]" />
                  
                  <div className="mt-4 text-sm text-[#E5E5E5]">
                    Reward: 100 bonus points (expires in 2 days)
                  </div>
                </div>
                
                <div>
                  <h3 className="flex items-center mb-3 font-medium">
                    <GiftIcon size={18} className="text-[#D4AF37] mr-2" />
                    Redeem Points
                  </h3>
                  
                  <button className="w-full py-3 bg-[#D4AF37] text-[#0A1128] rounded-md font-medium hover:bg-[#F2CA52] transition-colors">
                    Visit Rewards Store
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              <Tabs defaultValue="achievements" onValueChange={setActiveTab}>
                <TabsList className="bg-[#1C2541] border border-[#D4AF37]/20 w-full">
                  <TabsTrigger 
                    value="achievements"
                    className="flex-1 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
                  >
                    <Award size={16} className="mr-2" /> Achievements
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rewards"
                    className="flex-1 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
                  >
                    <Gift size={16} className="mr-2" /> Rewards
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className="flex-1 data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A1128]"
                  >
                    <Clock size={16} className="mr-2" /> History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="achievements" className="mt-6">
                  <h2 className="text-xl font-bold mb-6">Your Achievements</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {achievementsData?.map((achievement: any) => (
                      <AchievementCard 
                        key={achievement.id}
                        title={achievement.title}
                        description={achievement.description}
                        progress={achievement.progress}
                        points={achievement.points}
                        completed={achievement.completed}
                        icon={achievement.icon as any}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="rewards" className="mt-6">
                  <h2 className="text-xl font-bold mb-6">Available Rewards</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rewardsData?.map((reward: any) => (
                      <div key={reward.id} className="bg-[#1C2541] rounded-lg p-5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#0A1128] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                            <Gift size={24} />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium">{reward.title}</h3>
                            <p className="text-sm text-[#E5E5E5]">{reward.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-[#E5E5E5] mb-4">{reward.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-[#D4AF37] font-bold">{formatNumber(reward.pointsCost)} points</div>
                          <button 
                            className={`px-4 py-2 rounded-md ${
                              totalPoints >= reward.pointsCost
                                ? 'bg-[#D4AF37] text-[#0A1128] hover:bg-[#F2CA52]'
                                : 'bg-[#1C2541] text-[#E5E5E5] opacity-70 cursor-not-allowed border border-[#D4AF37]/30'
                            } transition-colors`}
                            disabled={totalPoints < reward.pointsCost}
                          >
                            {totalPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-6">
                  <h2 className="text-xl font-bold mb-6">Points History</h2>
                  
                  <div className="bg-[#1C2541] rounded-lg border border-[#D4AF37]/20 overflow-hidden">
                    <div className="p-4 bg-[#0A1128] border-b border-[#D4AF37]/30 grid grid-cols-12 font-medium">
                      <div className="col-span-7 sm:col-span-8">Activity</div>
                      <div className="col-span-3 sm:col-span-2 text-right">Points</div>
                      <div className="col-span-2 text-right">Date</div>
                    </div>
                    
                    <div className="divide-y divide-[#D4AF37]/10">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 grid grid-cols-12 items-center">
                          <div className="col-span-7 sm:col-span-8">
                            <div className="font-medium">Watched Interstellar</div>
                            <div className="text-sm text-[#E5E5E5]">Movie Completion</div>
                          </div>
                          <div className="col-span-3 sm:col-span-2 text-right font-medium text-[#D4AF37]">+25</div>
                          <div className="col-span-2 text-right text-sm text-[#E5E5E5]">2 days ago</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {activeTab === 'achievements' && (
                <LeaderboardSection />
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rewards;
