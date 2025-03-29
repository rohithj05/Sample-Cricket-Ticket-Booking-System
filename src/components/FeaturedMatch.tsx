
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedMatchProps {
  matches: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string;
    awayTeamLogo: string;
    date: string;
    time: string;
    venue: string;
    matchType: 'T20' | 'ODI' | 'Test';
    bannerImage: string;
  }>;
}

const FeaturedMatch = ({ matches }: FeaturedMatchProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % matches.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [matches.length]);
  
  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + matches.length) % matches.length);
  };
  
  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % matches.length);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  if (!matches.length) return null;
  
  const activeMatch = matches[activeIndex];
  const matchTypeColors = {
    T20: 'bg-green-100 text-green-800',
    ODI: 'bg-blue-100 text-blue-800',
    Test: 'bg-purple-100 text-purple-800',
  }[activeMatch.matchType];
  
  const handleViewMatch = () => {
    navigate(`/matches/${activeMatch.id}`);
  };
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${activeMatch.bannerImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <Badge className={`${matchTypeColors} mb-3 self-start`}>
          {activeMatch.matchType}
        </Badge>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3 p-1">
              {activeMatch.homeTeamLogo ? (
                <img src={activeMatch.homeTeamLogo} alt={activeMatch.homeTeam} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-white">{activeMatch.homeTeam.substring(0, 2)}</span>
              )}
            </div>
            <span className="font-semibold text-white text-lg md:text-xl">{activeMatch.homeTeam}</span>
          </div>
          
          <div className="flex flex-col items-center mx-4 md:mx-8">
            <span className="text-white/70 text-lg mb-2">VS</span>
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse-slow"></div>
              <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-3 p-1">
              {activeMatch.awayTeamLogo ? (
                <img src={activeMatch.awayTeamLogo} alt={activeMatch.awayTeam} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-white">{activeMatch.awayTeam.substring(0, 2)}</span>
              )}
            </div>
            <span className="font-semibold text-white text-lg md:text-xl">{activeMatch.awayTeam}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center text-white/90">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>{formatDate(activeMatch.date)}</span>
          </div>
          <div className="flex items-center text-white/90">
            <Clock className="w-5 h-5 mr-2" />
            <span>{activeMatch.time}</span>
          </div>
          <div className="flex items-center text-white/90">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{activeMatch.venue}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleViewMatch}
          className="w-full md:w-auto bg-cricket-600 hover:bg-cricket-700 text-white"
        >
          Book Tickets Now
        </Button>
      </div>
      
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {matches.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-white w-6' : 'bg-white/40'
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMatch;
