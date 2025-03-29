
import { useEffect, useState } from 'react';
import { Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fetchUserPoints, fetchRewards, Reward } from '@/services/rewardsService';
import { useAuth } from '@/components/AuthContext';

const PointsCard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [nextReward, setNextReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Only attempt to fetch if the user is logged in
        if (user) {
          const points = await fetchUserPoints();
          const rewards = await fetchRewards();
          
          // Sort rewards by points required and find the next available one
          const sortedRewards = rewards
            .filter(reward => reward.available)
            .sort((a, b) => a.pointsRequired - b.pointsRequired);
          
          // Find the next reward the user can earn
          const next = sortedRewards.find(reward => reward.pointsRequired > points) || sortedRewards[0] || null;
          
          setCurrentPoints(points);
          setNextReward(next);
        }
      } catch (error) {
        console.error('Error loading rewards data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  // Calculate points to next reward and progress percentage
  const pointsToNextReward = nextReward 
    ? Math.max(nextReward.pointsRequired - currentPoints, 0) 
    : 0;
    
  const progressPercentage = nextReward 
    ? Math.min((currentPoints / nextReward.pointsRequired) * 100, 100) 
    : 0;

  // If there's no next reward, show a placeholder
  const defaultReward = {
    name: "Free Premium Ticket",
    pointsRequired: 1000,
    icon: "https://via.placeholder.com/32?text=🎟️",
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Your Rewards</h3>
          <p className="text-gray-500 text-sm">Earn points with every booking</p>
        </div>
        <div className="bg-cricket-50 p-2 rounded-full">
          <Trophy className="w-5 h-5 text-cricket-600" />
        </div>
      </div>
      
      {loading ? (
        <div className="py-4 space-y-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse mt-6"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-500">Current Points</span>
              <span className="text-2xl font-bold text-cricket-700">{currentPoints}</span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
              <div 
                className="h-full bg-cricket-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>0</span>
              <span>{nextReward?.pointsRequired || defaultReward.pointsRequired}</span>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50 mb-6">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-white rounded-full mr-3 flex items-center justify-center shadow-sm">
                <img 
                  src={nextReward?.image || defaultReward.icon} 
                  alt={nextReward?.name || defaultReward.name} 
                  className="w-6 h-6 object-contain" 
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{nextReward?.name || defaultReward.name}</h4>
                <p className="text-xs text-gray-500">Next reward</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {pointsToNextReward > 0 
                ? `Earn ${pointsToNextReward} more points to unlock`
                : "You can claim this reward now!"}
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/rewards')}
            variant="outline" 
            className="w-full flex items-center justify-between"
          >
            <span>View All Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default PointsCard;
