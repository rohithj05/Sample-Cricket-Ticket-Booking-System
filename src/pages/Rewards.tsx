
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Gift, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthContext';
import { toast } from "sonner";
import { 
  fetchRewards, 
  fetchUserPoints, 
  fetchRedemptionHistory, 
  redeemReward,
  Reward,
  Redemption 
} from '@/services/rewardsService';

const Rewards = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rewardsData, setRewardsData] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [redemptionHistory, setRedemptionHistory] = useState<Redemption[]>([]);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // If not logged in, redirect to sign in
        if (!user) {
          toast.error('Please sign in to access rewards');
          navigate('/sign-in');
          return;
        }
        
        // Fetch all data in parallel
        const [rewards, points, history] = await Promise.all([
          fetchRewards(),
          fetchUserPoints(),
          fetchRedemptionHistory()
        ]);
        
        setRewardsData(rewards);
        setUserPoints(points);
        setRedemptionHistory(history);
      } catch (error) {
        console.error('Error loading rewards data:', error);
        toast.error('Failed to load rewards data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, navigate]);
  
  const filteredRewards = selectedTab === "all" 
    ? rewardsData 
    : rewardsData.filter(reward => reward.category === selectedTab);
  
  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmRedemption = async () => {
    setConfirmDialogOpen(false);
    
    if (!selectedReward) return;
    
    if (userPoints >= selectedReward.pointsRequired) {
      const success = await redeemReward(selectedReward.id, selectedReward.pointsRequired);
      
      if (success) {
        setUserPoints(prev => prev - selectedReward.pointsRequired);
        setSuccessDialogOpen(true);
        
        // Refresh redemption history
        const history = await fetchRedemptionHistory();
        setRedemptionHistory(history);
      }
    } else {
      uiToast({
        title: "Not enough points",
        description: `You need ${selectedReward.pointsRequired - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };
  
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    setSelectedReward(null);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cricket-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rewards...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header */}
        <section className="bg-cricket-600 py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Rewards Program</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Earn points when you book tickets and redeem them for exclusive rewards
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Points Balance</h2>
                  <Trophy className="w-6 h-6 text-white/80" />
                </div>
                <div className="text-4xl font-bold mb-2">{userPoints} points</div>
                <Button 
                  onClick={() => navigate('/matches')}
                  variant="secondary" 
                  className="mt-4 bg-white text-cricket-600 hover:bg-white/90"
                >
                  Book More Tickets
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Rewards Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Available Rewards</h2>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
                  <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
                  <TabsTrigger value="food">Food & Drink</TabsTrigger>
                  <TabsTrigger value="experiences">Experiences</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={selectedTab} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRewards.map((reward) => (
                    <Card 
                      key={reward.id}
                      className={`overflow-hidden transition-all duration-300 hover-scale ${
                        !reward.available ? 'opacity-70' : ''
                      }`}
                    >
                      
                      <CardHeader className="pb-2">
                        <CardTitle>{reward.name}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-lg font-bold text-cricket-700 mb-2">
                          {reward.pointsRequired} points
                        </div>
                        {!reward.available && (
                          <div className="text-sm text-red-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Temporarily unavailable
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleRewardClick(reward)}
                          className={`w-full ${
                            userPoints >= reward.pointsRequired && reward.available
                              ? 'bg-cricket-600 hover:bg-cricket-700'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200'
                          }`}
                          disabled={userPoints < reward.pointsRequired || !reward.available}
                        >
                          {userPoints >= reward.pointsRequired && reward.available
                            ? 'Redeem Now'
                            : userPoints < reward.pointsRequired 
                              ? `Need ${reward.pointsRequired - userPoints} more points`
                              : 'Currently Unavailable'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {filteredRewards.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Gift className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No rewards found</h3>
                    <p className="text-gray-500">
                      There are no rewards available in this category at the moment.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Redemption History */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Redemption History</h2>
            
            {redemptionHistory.length > 0 ? (
              <div className="bg-white rounded-xl overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Reward</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Points Spent</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redemptionHistory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{item.rewardName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.date)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{item.pointsSpent}</td>
                          <td className="px-6 py-4 text-sm">
                            {item.status === "redeemed" ? (
                              <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Redeemed
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3 mr-1" />
                                Expired
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No redemption history</h3>
                <p className="text-gray-500 mb-6">
                  You haven't redeemed any rewards yet.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTab("all")}
                >
                  Browse Rewards
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* How it Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How the Rewards Program Works</h2>
              <p className="text-lg text-gray-600">
                Earn points every time you book tickets and redeem them for exclusive rewards and experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "1. Book Tickets",
                  description: "Earn points with every ticket purchase. Premium seats earn more points!",
                  icon: "https://via.placeholder.com/64?text=🎟️",
                },
                {
                  title: "2. Collect Points",
                  description: "Points accumulate in your account. Check your balance anytime.",
                  icon: "https://via.placeholder.com/64?text=🔄",
                },
                {
                  title: "3. Redeem Rewards",
                  description: "Use your points to get free tickets, upgrades, and exclusive experiences.",
                  icon: "https://via.placeholder.com/64?text=🎁",
                },
              ].map((step, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Redemption</DialogTitle>
              <DialogDescription>
                Are you sure you want to redeem this reward?
              </DialogDescription>
            </DialogHeader>
            
            {selectedReward && (
              <div className="py-4">
                <div className="flex items-center mb-4">
                 
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedReward.name}</h4>
                    <p className="text-sm text-gray-500">{selectedReward.description}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Your current balance</span>
                  <span className="font-medium">{userPoints} points</span>
                </div>
                
                <div className="flex justify-between items-center py-2 text-cricket-700">
                  <span className="font-medium">Cost</span>
                  <span className="font-bold">- {selectedReward.pointsRequired} points</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-medium text-gray-900">Remaining balance</span>
                  <span className="font-bold">
                    {userPoints - selectedReward.pointsRequired} points
                  </span>
                </div>
                
                {userPoints < selectedReward.pointsRequired && (
                  <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You don't have enough points to redeem this reward. You need 
                      {' '}<strong>{selectedReward.pointsRequired - userPoints}</strong>{' '}
                      more points.
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRedemption}
                className={
                  userPoints >= (selectedReward?.pointsRequired || 0)
                    ? 'bg-cricket-600 hover:bg-cricket-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                }
                disabled={userPoints < (selectedReward?.pointsRequired || 0)}
              >
                Confirm Redemption
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redemption Successful!</DialogTitle>
              <DialogDescription>
                Your reward has been successfully redeemed.
              </DialogDescription>
            </DialogHeader>
            
            {selectedReward && (
              <div className="py-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedReward.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  You have successfully redeemed this reward for {selectedReward.pointsRequired} points.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600">
                    Your new points balance is:
                  </p>
                  <p className="text-2xl font-bold text-cricket-700">
                    {userPoints - selectedReward.pointsRequired} points
                  </p>
                </div>
                
                <p className="text-sm text-gray-500">
                  You can view your redeemed rewards in your profile at any time.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                onClick={handleCloseSuccessDialog}
                className="bg-cricket-600 hover:bg-cricket-700"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;
