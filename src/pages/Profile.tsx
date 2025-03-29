
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tables } from '@/integrations/supabase/types';
import { UserCircle, Ticket, Trophy, PenLine, Save } from 'lucide-react';

type ProfileData = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  points: number | null;
  created_at: string;
};

type BookingWithMatch = {
  id: string;
  match_id: string;
  seats: number;
  total_amount: number;
  points_earned: number;
  booking_date: string;
  match: {
    team1: string;
    team2: string;
    match_date: string;
    venue: string;
    match_type: string;
  };
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<BookingWithMatch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      navigate('/sign-in');
      return;
    }
    
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData as ProfileData);
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        
        // Fetch bookings with match details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            match: matches (
              team1,
              team2,
              match_date,
              venue,
              match_type
            )
          `)
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });
        
        if (bookingsError) {
          throw bookingsError;
        }
        
        setBookings(bookingsData as BookingWithMatch[]);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, loading, navigate, toast]);
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          first_name: firstName,
          last_name: lastName,
        };
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-cricket-600 border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile</span>
                  {!isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsEditing(true)}
                    >
                      <PenLine className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-cricket-100 flex items-center justify-center">
                    <UserCircle className="h-16 w-16 text-cricket-600" />
                  </div>
                </div>
                
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {profile?.first_name} {profile?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <div className="bg-cricket-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-cricket-600 mr-2" />
                          <span className="text-sm font-medium">Reward Points</span>
                        </div>
                        <Badge className="bg-cricket-600">
                          {profile?.points || 0} points
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">
                        Member since: {new Date(profile?.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(profile?.first_name || '');
                      setLastName(profile?.last_name || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-cricket-600 hover:bg-cricket-700"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
            
            {/* Booking History */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>Your recent ticket bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                    <p className="text-gray-500 mt-2">
                      You haven't booked any tickets yet. Explore upcoming matches.
                    </p>
                    <Button 
                      className="mt-6 bg-cricket-600 hover:bg-cricket-700"
                      onClick={() => navigate('/matches')}
                    >
                      Browse Matches
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {booking.match.team1} vs {booking.match.team2}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.match.match_date).toLocaleDateString()} | {booking.match.venue}
                              </p>
                            </div>
                            <Badge className="self-start sm:self-center bg-cricket-600">{booking.match.match_type}</Badge>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500">Seats</p>
                              <p className="font-medium">{booking.seats}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Amount Paid</p>
                              <p className="font-medium">₹{booking.total_amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Points Earned</p>
                              <p className="font-medium text-cricket-600">{booking.points_earned} points</p>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => navigate(`/matches/${booking.match_id}`)}
                            >
                              View Match
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
