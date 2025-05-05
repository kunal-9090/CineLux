import { useState } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import ContentRow from '@/components/home/content-row';
import GenreSelector from '@/components/home/genre-selector';
import AchievementCard from '@/components/home/achievement-card';
import LeaderboardSection from '@/components/home/leaderboard-section';
import { Award, Star, Crown } from 'lucide-react';

const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        <HeroSection />
        
        <ContentRow 
          title="Continue Watching" 
          endpoint={`/api/movies/continue-watching${selectedGenre ? `?genre=${selectedGenre}` : ''}`}
          viewAllLink="/browse?filter=continue-watching"
        />
        
        <GenreSelector onSelectGenre={setSelectedGenre} />
        
        <ContentRow 
          title="Trending Now" 
          endpoint={`/api/movies/trending${selectedGenre ? `?genre=${selectedGenre}` : ''}`}
          viewAllLink="/browse?filter=trending"
        />
        
        {/* Gamification Section */}
        <section className="px-6 md:px-16 py-12 bg-gradient-to-b from-[#1C2541] to-[#0A1128]">
          <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center">
            <Award size={24} className="text-[#D4AF37] mr-2" />
            Your Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AchievementCard 
              title="Franchise Master" 
              description="Complete watching all Marvel movies" 
              progress={80}
              points={100}
              icon="award"
            />
            <AchievementCard 
              title="Weekly Watcher" 
              description="Watch content for 7 consecutive days" 
              progress={100}
              points={50}
              completed
              icon="star"
            />
            <AchievementCard 
              title="Quiz Champion" 
              description="Score 100% on 5 different movie quizzes" 
              progress={40}
              points={75}
              icon="crown"
            />
          </div>
        </section>
        
        <LeaderboardSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
