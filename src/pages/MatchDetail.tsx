
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Clock, MapPin, ArrowLeft, Share2, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SeatSelection from '@/components/SeatSelection';
import { useMatch } from '@/hooks/useMatches';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  
  const { data: match, isLoading, error } = useMatch(id || '');
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Match Not Found</h2>
            <p className="text-gray-500 mb-6">The match you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/matches')}>Back to Matches</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isLoading || !match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="h-[300px] bg-gray-200 rounded-xl animate-pulse mb-8"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-8 w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
              <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  const matchTypeColors = {
    T20: 'bg-green-100 text-green-800',
    ODI: 'bg-blue-100 text-blue-800',
    Test: 'bg-purple-100 text-purple-800',
  }[match?.matchType || 'T20'];
  
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }
    setBookingDialogOpen(true);
  };
  
  const handleSeatSelect = (selected: any) => {
    setSelectedSeats(selected);
    setBookingDialogOpen(false);
    setConfirmationDialogOpen(true);
  };
  
  const handleConfirmBooking = async () => {
    if (!user || !match || !selectedSeats) {
      toast({
        title: "Error",
        description: "Missing required information to complete booking",
        variant: "destructive",
      });
      return;
    }
    
    setIsBooking(true);
    
    try {
      const totalAmount = selectedSeats.category.price * selectedSeats.count;
      const pointsEarned = selectedSeats.category.pointsEarned * selectedSeats.count;
      
      console.log("Inserting booking with match_id:", match.id);
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          match_id: match.id, // This is now a valid UUID from our updated mock data
          seats: selectedSeats.count,
          total_amount: totalAmount,
          points_earned: pointsEarned
        });
      
      if (bookingError) throw bookingError;
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const currentPoints = profileData?.points || 0;
      const newPoints = currentPoints + pointsEarned;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Booking Successful!",
        description: `You have booked ${selectedSeats.count} ${selectedSeats.category.name} seat${selectedSeats.count > 1 ? 's' : ''} for ${match.homeTeam} vs ${match.awayTeam}. You earned ${pointsEarned} points!`,
        variant: "default",
      });
      
      setConfirmationDialogOpen(false);
      navigate('/profile');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error?.message || "There was a problem processing your booking",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${match.bannerImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/matches')}
                className="mb-4 text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
              
              <Badge className={`${matchTypeColors} mb-3`}>
                {match.matchType}
              </Badge>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {match.homeTeam} vs {match.awayTeam}
              </h1>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-white/90">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{formatDate(match.date)}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{match.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Details</h2>
                <p className="text-gray-600 mb-6">
                  {match.description}
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Teams</h3>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-lg border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {match.homeTeamLogo ? (
                          <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-gray-500">{match.homeTeam.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{match.homeTeam}</h4>
                        <p className="text-xs text-gray-500">Home Team</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {match.awayTeamLogo ? (
                          <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-gray-500">{match.awayTeam.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{match.awayTeam}</h4>
                        <p className="text-xs text-gray-500">Away Team</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue Information</h3>
                <p className="text-gray-600 mb-6">
                  {match.venue} is a world-class cricket stadium with excellent facilities for fans.
                  The venue offers great views from all seating areas, convenient access to food and 
                  beverages, and is easily accessible by public transportation.
                </p>
                
                <div className="flex space-x-4 mb-8">
                  <Button 
                    onClick={handleBookNow}
                    className="bg-cricket-600 hover:bg-cricket-700"
                  >
                    Book Now
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Share feature",
                        description: "In a real app, this would open a share dialog to share the match details.",
                      });
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-cricket-50 border border-cricket-100">
                  <h4 className="font-medium text-gray-900 mb-2">Reward Points</h4>
                  <p className="text-sm text-gray-600">
                    Book tickets for this match and earn up to {Math.max(...match.seatCategories.map(c => c.pointsEarned))} reward points,
                    depending on your seat category. Points can be redeemed for exclusive rewards.
                  </p>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h2>
                  
                  <SeatSelection 
                    matchId={match.id}
                    categories={match.seatCategories}
                    onSeatSelect={handleSeatSelect}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Select Seats</DialogTitle>
              <DialogDescription>
                Choose your preferred seat category and the number of seats for this match.
              </DialogDescription>
            </DialogHeader>
            
            <SeatSelection 
              matchId={match.id}
              categories={match.seatCategories}
              onSeatSelect={handleSeatSelect}
            />
          </DialogContent>
        </Dialog>
        
        <Dialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Please review your booking details before confirming.
              </DialogDescription>
            </DialogHeader>
            
            {selectedSeats && (
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Match</span>
                  <span className="text-gray-900">{match.homeTeam} vs {match.awayTeam}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Date & Time</span>
                  <span className="text-gray-900">{formatDate(match.date)} at {match.time}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Venue</span>
                  <span className="text-gray-900">{match.venue}</span>
                </div>
                
                <Separator />
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Seat Category</span>
                  <span className="text-gray-900">{selectedSeats.category.name}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Number of Seats</span>
                  <span className="text-gray-900">{selectedSeats.count}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-gray-500">Price per Seat</span>
                  <span className="text-gray-900">${selectedSeats.category.price.toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Price</span>
                  <span className="font-bold text-cricket-700">
                    ${(selectedSeats.category.price * selectedSeats.count).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Points you'll earn</span>
                  <span className="font-medium text-cricket-600">
                    +{selectedSeats.category.pointsEarned * selectedSeats.count} points
                  </span>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmationDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmBooking}
                className="bg-cricket-600 hover:bg-cricket-700"
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default MatchDetail;
