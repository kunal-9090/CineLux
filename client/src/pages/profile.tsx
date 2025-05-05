import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Mail, 
  Shield, 
  LogOut, 
  Edit, 
  Star, 
  Award, 
  List,
  Activity,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');

  // Define types for our API responses
  interface PointsData {
    total: number;
    transactions: Array<{
      id: number;
      userId: number;
      amount: number;
      description: string;
      createdAt: string;
    }>;
  }

  interface Achievement {
    id: number;
    title: string;
    description: string;
    points: number;
    completed?: boolean;
    progress?: number;
  }

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery<PointsData>({
    queryKey: ['/api/users/points'],
    enabled: true,
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    enabled: true,
  });

  // Placeholder user data when actual data is loading
  const user = {
    username: 'user',
    email: 'user@example.com',
    memberSince: 'January 2022',
    points: userData?.total || 0,
    profileImage: null
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A1128]">
      <Navbar />
      
      <main className="flex-grow pt-24 md:pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile Sidebar */}
              <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
                <Card className="bg-[#1C2541] border-[#2E3A59]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-24 h-24 rounded-full bg-[#D4AF37] flex items-center justify-center mb-3">
                        <User size={48} className="text-[#0A1128]" />
                      </div>
                      <h3 className="text-xl font-semibold">{user.username}</h3>
                      <p className="text-[#A9B2C8] text-sm">{user.email}</p>
                      <div className="flex items-center mt-2">
                        <Star size={16} className="text-[#D4AF37] mr-1" />
                        <span className="font-medium">{user.points.toLocaleString()} points</span>
                      </div>
                      <p className="text-[#A9B2C8] text-xs mt-1">Member since {user.memberSince}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        variant={activeTab === 'account' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('account')}
                      >
                        <User size={18} className="mr-2" />
                        Account
                      </Button>
                      <Button 
                        variant={activeTab === 'activity' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('activity')}
                      >
                        <Activity size={18} className="mr-2" />
                        Activity
                      </Button>
                      <Button 
                        variant={activeTab === 'achievements' ? 'secondary' : 'ghost'}
                        className="w-full justify-start" 
                        onClick={() => setActiveTab('achievements')}
                      >
                        <Award size={18} className="mr-2" />
                        Achievements
                      </Button>
                      <Button 
                        variant={activeTab === 'watchlist' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('watchlist')}
                      >
                        <List size={18} className="mr-2" />
                        Watchlist
                      </Button>
                      <Button 
                        variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('settings')}
                      >
                        <Settings size={18} className="mr-2" />
                        Settings
                      </Button>
                      <Button 
                        variant={activeTab === 'support' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('support')}
                      >
                        <HelpCircle size={18} className="mr-2" />
                        Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content Area */}
              <div className="w-full md:w-2/3 lg:w-3/4">
                {activeTab === 'account' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User size={22} className="mr-2 text-[#D4AF37]" />
                        Account Information
                      </CardTitle>
                      <CardDescription>
                        Manage your personal information and account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Username</h4>
                            <p className="text-[#A9B2C8]">{user.username}</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            <Edit size={16} className="mr-1" /> Edit
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Email Address</h4>
                            <p className="text-[#A9B2C8]">{user.email}</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            <Edit size={16} className="mr-1" /> Edit
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Password</h4>
                            <p className="text-[#A9B2C8]">********</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            <Edit size={16} className="mr-1" /> Change
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Subscription Plan</h4>
                            <p className="text-[#A9B2C8]">Premium (Annual)</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="destructive" className="w-full sm:w-auto">
                        <LogOut size={16} className="mr-2" /> Sign Out
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {activeTab === 'activity' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity size={22} className="mr-2 text-[#D4AF37]" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        Track your watching history and point transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="history">
                        <TabsList className="bg-[#0A1128]">
                          <TabsTrigger value="history">Watch History</TabsTrigger>
                          <TabsTrigger value="points">Point Transactions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="history" className="pt-4 space-y-4">
                          {userData && userData.transactions && userData.transactions.length > 0 ? (
                            userData.transactions.map((transaction, index: number) => (
                              <div key={index} className="flex justify-between items-center p-3 rounded-md bg-[#2E3A59]">
                                <div>
                                  <h4 className="font-medium">Watched "{transaction.description || 'Movie'}"</h4>
                                  <p className="text-sm text-[#A9B2C8]">{new Date(transaction.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[#D4AF37] font-medium">+{transaction.amount} points</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p>No watch history available</p>
                            </div>
                          )}
                        </TabsContent>
                        <TabsContent value="points" className="pt-4 space-y-4">
                          {userData && userData.transactions && userData.transactions.length > 0 ? (
                            userData.transactions.map((transaction, index: number) => (
                              <div key={index} className="flex justify-between items-center p-3 rounded-md bg-[#2E3A59]">
                                <div>
                                  <h4 className="font-medium">{transaction.description || 'Point Transaction'}</h4>
                                  <p className="text-sm text-[#A9B2C8]">{new Date(transaction.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-[#D4AF37] font-medium">+{transaction.amount} points</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <p>No point transactions available</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'achievements' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award size={22} className="mr-2 text-[#D4AF37]" />
                        Achievements
                      </CardTitle>
                      <CardDescription>
                        Track your progress and unlock exclusive rewards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {achievements && achievements.length > 0 ? (
                          achievements.map((achievement, index) => (
                            <div key={index} className="p-4 rounded-md bg-[#2E3A59] flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center mr-3">
                                  <Award size={20} className="text-[#0A1128]" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{achievement.title}</h4>
                                  <p className="text-sm text-[#A9B2C8]">{achievement.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="text-[#D4AF37] font-medium mr-2">{achievement.points} points</span>
                                {achievement.completed ? (
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="text-sm text-[#A9B2C8]">{achievement.progress || 0}%</div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p>No achievements available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'watchlist' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <List size={22} className="mr-2 text-[#D4AF37]" />
                        Your Watchlist
                      </CardTitle>
                      <CardDescription>
                        Movies and shows you want to watch later
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <p className="text-lg mb-4">Your watchlist is empty</p>
                        <p className="text-[#A9B2C8] mb-6">Start building your watchlist by adding movies and shows</p>
                        <Button>
                          Browse Movies
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'settings' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings size={22} className="mr-2 text-[#D4AF37]" />
                        Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your preferences and account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Notifications</h4>
                            <p className="text-[#A9B2C8]">Email notifications for new releases and recommendations</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-5 bg-[#D4AF37] rounded-full relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Language</h4>
                            <p className="text-[#A9B2C8]">English (US)</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            Change
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Playback Quality</h4>
                            <p className="text-[#A9B2C8]">Auto (Up to 4K Ultra HD)</p>
                          </div>
                          <Button variant="outline" size="sm" className="text-[#D4AF37] border-[#D4AF37]">
                            Change
                          </Button>
                        </div>
                        
                        <div className="flex justify-between items-center pb-3 border-b border-[#2E3A59]">
                          <div>
                            <h4 className="font-medium">Autoplay</h4>
                            <p className="text-[#A9B2C8]">Play next episode automatically</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-10 h-5 bg-[#D4AF37] rounded-full relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'support' && (
                  <Card className="bg-[#1C2541] border-[#2E3A59]">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HelpCircle size={22} className="mr-2 text-[#D4AF37]" />
                        Customer Support
                      </CardTitle>
                      <CardDescription>
                        Get help with your account and subscription
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center p-4 rounded-md bg-[#2E3A59] cursor-pointer hover:bg-[#3A4B6A] transition-colors">
                          <Mail size={20} className="mr-3 text-[#D4AF37]" />
                          <div className="flex-1">
                            <h4 className="font-medium">Contact Support</h4>
                            <p className="text-sm text-[#A9B2C8]">Email our support team for assistance</p>
                          </div>
                          <ChevronRight size={18} />
                        </div>
                        
                        <div className="flex items-center p-4 rounded-md bg-[#2E3A59] cursor-pointer hover:bg-[#3A4B6A] transition-colors">
                          <Shield size={20} className="mr-3 text-[#D4AF37]" />
                          <div className="flex-1">
                            <h4 className="font-medium">Privacy & Security</h4>
                            <p className="text-sm text-[#A9B2C8]">Manage your privacy settings and security options</p>
                          </div>
                          <ChevronRight size={18} />
                        </div>
                        
                        <div className="flex items-center p-4 rounded-md bg-[#2E3A59] cursor-pointer hover:bg-[#3A4B6A] transition-colors">
                          <HelpCircle size={20} className="mr-3 text-[#D4AF37]" />
                          <div className="flex-1">
                            <h4 className="font-medium">FAQ</h4>
                            <p className="text-sm text-[#A9B2C8]">Browse common questions and answers</p>
                          </div>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md bg-[#0A1128] text-center">
                        <h4 className="font-medium mb-2">Need immediate assistance?</h4>
                        <p className="text-sm text-[#A9B2C8] mb-4">Our support team is available 24/7</p>
                        <Button variant="default" className="bg-[#D4AF37] text-[#0A1128] hover:bg-[#B8973D]">
                          <Mail size={16} className="mr-2" /> Contact Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;