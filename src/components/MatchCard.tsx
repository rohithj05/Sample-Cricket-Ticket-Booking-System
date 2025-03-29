
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  date: string;
  time: string;
  venue: string;
  availableSeats: number;
  matchType: 'T20' | 'ODI' | 'Test';
}

const MatchCard = ({
  id,
  homeTeam,
  awayTeam,
  homeTeamLogo,
  awayTeamLogo,
  date,
  time,
  venue,
  availableSeats,
  matchType,
}: MatchCardProps) => {
  const navigate = useNavigate();
  
  const handleViewMatch = () => {
    navigate(`/matches/${id}`);
  };
  
  const matchTypeColors = {
    T20: 'bg-green-100 text-green-800',
    ODI: 'bg-blue-100 text-blue-800',
    Test: 'bg-purple-100 text-purple-800',
  }[matchType];
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover-scale">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <Badge className={matchTypeColors}>{matchType}</Badge>
          <span className="text-xs font-medium text-gray-500">
            {availableSeats} seats left
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center text-center w-1/3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
              <img src={homeTeamLogo} alt={homeTeam} className="w-12 h-12 object-contain" />
            </div>
            <span className="font-semibold text-sm">{homeTeam}</span>
          </div>
          
          <div className="flex flex-col items-center w-1/3">
            <span className="text-xs font-medium text-gray-500 mb-1">VS</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-cricket-600 rounded-full animate-pulse-slow"></div>
              <div className="w-2 h-2 bg-cricket-300 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-cricket-100 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center w-1/3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
              <img src={awayTeamLogo} alt={awayTeam} className="w-12 h-12 object-contain" />
            </div>
            <span className="font-semibold text-sm">{awayTeam}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-5">
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon className="w-4 h-4 mr-2 text-cricket-500" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-2 text-cricket-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-cricket-500" />
            <span>{venue}</span>
          </div>
        </div>
        
        <Button 
          onClick={handleViewMatch} 
          className="w-full bg-cricket-600 hover:bg-cricket-700"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
