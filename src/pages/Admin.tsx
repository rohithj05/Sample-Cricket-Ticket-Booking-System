
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  Ticket, 
  Trophy, 
  BarChart3, 
  Settings, 
  PlusCircle, 
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useMatches, Match } from '@/hooks/useMatches';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: matches, isLoading } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock booking data
  const bookings = [
    { id: "1", user: "John Smith", match: "India vs Australia", ticketCount: 2, amount: 300, status: "confirmed" },
    { id: "2", user: "Emily Johnson", match: "England vs West Indies", ticketCount: 1, amount: 80, status: "confirmed" },
    { id: "3", user: "Michael Brown", match: "New Zealand vs South Africa", ticketCount: 4, amount: 400, status: "pending" },
    { id: "4", user: "Sarah Davis", match: "Pakistan vs Sri Lanka", ticketCount: 2, amount: 180, status: "cancelled" },
    { id: "5", user: "Robert Wilson", match: "Bangladesh vs Afghanistan", ticketCount: 3, amount: 240, status: "confirmed" },
  ];
  
  // Mock rewards data
  const rewards = [
    { id: "1", name: "Free Match Ticket", pointsRequired: 1000, redeemed: 45, status: "active" },
    { id: "2", name: "Premium Seat Upgrade", pointsRequired: 800, redeemed: 28, status: "active" },
    { id: "3", name: "Team Merchandise Voucher", pointsRequired: 500, redeemed: 67, status: "active" },
    { id: "4", name: "Free Food & Beverage", pointsRequired: 300, redeemed: 112, status: "inactive" },
    { id: "5", name: "VIP Lounge Access", pointsRequired: 1500, redeemed: 15, status: "active" },
  ];
  
  // Mock users data
  const users = [
    { id: "1", name: "John Smith", email: "john.smith@example.com", bookings: 5, points: 1350, joinDate: "2023-01-15" },
    { id: "2", name: "Emily Johnson", email: "emily.johnson@example.com", bookings: 3, points: 850, joinDate: "2023-02-10" },
    { id: "3", name: "Michael Brown", email: "michael.brown@example.com", bookings: 2, points: 450, joinDate: "2023-03-22" },
    { id: "4", name: "Sarah Davis", email: "sarah.davis@example.com", bookings: 7, points: 1800, joinDate: "2023-01-05" },
    { id: "5", name: "Robert Wilson", email: "robert.wilson@example.com", bookings: 4, points: 1100, joinDate: "2023-02-28" },
  ];
  
  const filteredMatches = matches?.filter(match => 
    match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    match.venue.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteMatch = (match: Match) => {
    setSelectedMatch(match);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    // In a real app, this would send a delete request to the backend
    toast({
      title: "Match Deleted",
      description: `${selectedMatch?.homeTeam} vs ${selectedMatch?.awayTeam} has been deleted.`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedMatch(null);
  };
  
  const handleSaveMatch = () => {
    // In a real app, this would send updated match data to the backend
    toast({
      title: "Match Updated",
      description: `${selectedMatch?.homeTeam} vs ${selectedMatch?.awayTeam} has been updated.`,
    });
    
    setIsEditDialogOpen(false);
    setSelectedMatch(null);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header */}
        <section className="bg-cricket-600 py-8 px-4 sm:px-6 lg:px-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-white/90">
                Manage matches, bookings, rewards, and users
              </p>
            </div>
          </div>
        </section>
        
        {/* Dashboard Overview */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 text-cricket-600 mr-2" />
                    <div className="text-3xl font-bold">{matches?.length || 0}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-cricket-600 mr-2" />
                    <div className="text-3xl font-bold">{bookings.length}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-cricket-600 mr-2" />
                    <div className="text-3xl font-bold">{rewards.filter(r => r.status === 'active').length}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-cricket-600 mr-2" />
                    <div className="text-3xl font-bold">{users.length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <Tabs defaultValue="matches" className="space-y-8">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 lg:inline-flex">
                <TabsTrigger value="matches" className="flex items-center">
                  <Ticket className="w-4 h-4 mr-2" />
                  <span>Matches</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2" />
                  <span>Rewards</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Users</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Matches Tab */}
              <TabsContent value="matches">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Matches</h2>
                    <div className="flex space-x-4">
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          placeholder="Search matches..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button className="bg-cricket-600 hover:bg-cricket-700 whitespace-nowrap">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Match
                      </Button>
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-cricket-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading matches...</p>
                    </div>
                  ) : filteredMatches.length > 0 ? (
                    <div className="bg-white rounded-xl overflow-hidden shadow">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Match</TableHead>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Venue</TableHead>
                              <TableHead>Available Seats</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMatches.map((match) => (
                              <TableRow key={match.id}>
                                <TableCell className="font-medium">
                                  {match.homeTeam} vs {match.awayTeam}
                                </TableCell>
                                <TableCell>{formatDate(match.date)} at {match.time}</TableCell>
                                <TableCell>{match.venue}</TableCell>
                                <TableCell>{match.availableSeats}</TableCell>
                                <TableCell>
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                                    match.matchType === 'T20' ? 'bg-green-100 text-green-800' :
                                    match.matchType === 'ODI' ? 'bg-blue-100 text-blue-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {match.matchType}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditMatch(match)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteMatch(match)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
                      {searchTerm ? (
                        <p className="text-gray-500 mb-4">No matches match your search term. Try a different term.</p>
                      ) : (
                        <p className="text-gray-500 mb-4">No matches have been added yet.</p>
                      )}
                      <Button className="bg-cricket-600 hover:bg-cricket-700">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Match
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
                  
                  <div className="bg-white rounded-xl overflow-hidden shadow">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Match</TableHead>
                            <TableHead>Tickets</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.user}</TableCell>
                              <TableCell>{booking.match}</TableCell>
                              <TableCell>{booking.ticketCount}</TableCell>
                              <TableCell>${booking.amount}</TableCell>
                              <TableCell>
                                {booking.status === 'confirmed' ? (
                                  <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Confirmed
                                  </span>
                                ) : booking.status === 'pending' ? (
                                  <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Cancelled
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "View Booking",
                                      description: `In a real app, this would open booking #${booking.id} details.`,
                                    });
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Rewards Tab */}
              <TabsContent value="rewards">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Rewards</h2>
                    <Button className="bg-cricket-600 hover:bg-cricket-700">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Reward
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-xl overflow-hidden shadow">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Reward Name</TableHead>
                            <TableHead>Points Required</TableHead>
                            <TableHead>Times Redeemed</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rewards.map((reward) => (
                            <TableRow key={reward.id}>
                              <TableCell className="font-medium">{reward.name}</TableCell>
                              <TableCell>{reward.pointsRequired}</TableCell>
                              <TableCell>{reward.redeemed}</TableCell>
                              <TableCell>
                                {reward.status === 'active' ? (
                                  <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-gray-700 bg-gray-200 px-2.5 py-1 rounded-full text-xs font-medium">
                                    Inactive
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      toast({
                                        title: "Edit Reward",
                                        description: `In a real app, this would open the editor for ${reward.name}.`,
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      toast({
                                        title: reward.status === 'active' ? "Deactivate Reward" : "Activate Reward",
                                        description: `In a real app, this would ${reward.status === 'active' ? 'deactivate' : 'activate'} ${reward.name}.`,
                                      });
                                    }}
                                  >
                                    {reward.status === 'active' ? "Deactivate" : "Activate"}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
                  
                  <div className="bg-white rounded-xl overflow-hidden shadow">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Total Bookings</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.bookings}</TableCell>
                              <TableCell>{user.points}</TableCell>
                              <TableCell>{formatDate(user.joinDate)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      toast({
                                        title: "View User",
                                        description: `In a real app, this would show details for ${user.name}.`,
                                      });
                                    }}
                                  >
                                    View
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      toast({
                                        title: "Edit User",
                                        description: `In a real app, this would open the editor for ${user.name}.`,
                                      });
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Edit Match Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Match</DialogTitle>
              <DialogDescription>
                Make changes to the match details below.
              </DialogDescription>
            </DialogHeader>
            
            {selectedMatch && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="home-team">Home Team</label>
                    <Input id="home-team" defaultValue={selectedMatch.homeTeam} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="away-team">Away Team</label>
                    <Input id="away-team" defaultValue={selectedMatch.awayTeam} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="date">Date</label>
                    <Input id="date" type="date" defaultValue={selectedMatch.date} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="time">Time</label>
                    <Input id="time" type="time" defaultValue={selectedMatch.time} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="venue">Venue</label>
                  <Input id="venue" defaultValue={selectedMatch.venue} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="type">Match Type</label>
                    <select 
                      id="type" 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue={selectedMatch.matchType}
                    >
                      <option value="T20">T20</option>
                      <option value="ODI">ODI</option>
                      <option value="Test">Test</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="seats">Available Seats</label>
                    <Input id="seats" type="number" defaultValue={selectedMatch.availableSeats} />
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveMatch} className="bg-cricket-600 hover:bg-cricket-700">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Match Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this match? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedMatch && (
              <div className="py-4">
                <div className="p-4 rounded-lg bg-gray-50 mb-4">
                  <h3 className="font-medium text-gray-900">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(selectedMatch.date)} at {selectedMatch.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedMatch.venue}
                  </p>
                </div>
                
                <p className="text-amber-600 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  This will remove the match and all associated bookings.
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Delete Match</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
