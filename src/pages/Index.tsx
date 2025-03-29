import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Search, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeaturedMatch from '@/components/FeaturedMatch';
import MatchCard from '@/components/MatchCard';
import PointsCard from '@/components/PointsCard';
import { useMatches } from '@/hooks/useMatches';
import Chatbot from '@/components/ChatBot';



const Index = () => {
  const navigate = useNavigate();
  const { data: matches, isLoading } = useMatches();
  const [featuredMatches, setFeaturedMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (matches) {
      // Get first 3 matches for featured section
      setFeaturedMatches(matches.slice(0, 3));
      
      // Get next 3 matches for upcoming section
      setUpcomingMatches(matches.slice(0, 3));
    }
  }, [matches]);

  const toggleChatbot = () => setShowChatbot(!showChatbot);

  
  return (
    <div className="min-h-screen flex flex-col">
       {/* Chatbot Section */}
       <div className={`fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 ${
        showChatbot ? 'w-[400px]' : 'w-0'
      }  shadow-lg border-r`}>
        <div className={`h-full ${showChatbot ? 'block' : 'hidden'}`}>
          <div className="flex justify-between items-center p-8 ">
            <button 
              onClick={toggleChatbot} 
              className="text-gray-500 hover:text-gray-700"
            >
            </button>
          </div>
          <Chatbot />
        </div>
      </div>

      <Navbar />
      <main className="flex-grow pt-16">
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
                <span className="inline-block px-3 py-1 rounded-full bg-cricket-100 text-cricket-800 text-xs font-medium tracking-wide mb-4">
                  The Premier Cricket Booking Platform
                </span>
                <div className="w-full bg-white/70 text-black py-4 px-6 text-center">
                  <p className="font-medium">
                    Rohith J (23BDS1125) • Koushik Ravuru (23BDS1114) • Chendhuran N (23BDS1014)
                  </p>
                  <p className="mt-1">
                    Course: Webprogramming (BCSE203E), Year: 2025, Branch: B.tech CSE Data Science
                  </p>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
                  Experience Cricket Like Never Before
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-3xl mx-auto">
                  Book tickets for the hottest cricket matches and earn rewards with every purchase.
                  Join thousands of fans in stadiums across the world.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/matches')}
                    className="text-white bg-cricket-600 hover:bg-cricket-700 h-12 px-6 w-full sm:w-auto"
                    size="lg"
                  >
                    Browse Matches
                  </Button>
                  <Button 
                    onClick={() => navigate('/rewards')}
                    variant="outline" 
                    className="h-12 px-6 w-full sm:w-auto"
                    size="lg"
                  >
                    View Rewards
                  </Button>
                </div>
              </div>

            {/* Featured Match Slider */}
            {isLoading ? (
              <div className="w-full h-[500px] rounded-2xl bg-gray-200 animate-pulse"></div>
            ) : featuredMatches.length > 0 ? (
              <FeaturedMatch matches={featuredMatches} />
            ) : (
              <div className="w-full h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-lg">No featured matches available</p>
              </div>
            )}
          </div>
        </section>
        {isLoading ? (
                <div className="w-full h-[500px] rounded-2xl bg-gray-200 animate-pulse"></div>
              ) : featuredMatches.length > 0 ? (
                <FeaturedMatch matches={featuredMatches} />
              ) : (
                <div className="w-full h-[500px] rounded-2xl bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-lg">No featured matches available</p>
                </div>
              )}
        
        {/* Upcoming Matches */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Upcoming Matches</h2>
                <p className="text-gray-500">Don't miss these exciting cricket events</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  onClick={() => navigate('/matches')}
                  variant="outline" 
                  className="flex items-center space-x-2"
                >
                  <span>View All Matches</span>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="h-[420px] bg-gray-200 rounded-xl animate-pulse"></div>
                ))
              ) : upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))
              ) : (
                <div className="col-span-3 py-16 text-center">
                  <p className="text-gray-500 text-lg">No upcoming matches available</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Rewards Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-cricket-100 text-cricket-800 text-xs font-medium tracking-wide mb-1">
                    Reward System
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Earn Points With Every Ticket Purchase
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Our innovative reward system lets you earn points every time you book a ticket.
                    Redeem your points for exclusive rewards like free tickets, merchandise, and VIP experiences.
                  </p>
                  <div className="space-y-4">
                    {[
                      { title: "Points Per Purchase", description: "Earn up to 300 points per ticket based on seat category" },
                      { title: "Special Bonuses", description: "Get bonus points during promotional events and tournaments" },
                      { title: "Exclusive Rewards", description: "Redeem points for tickets, merchandise, and VIP experiences" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-cricket-100 flex items-center justify-center mt-1">
                          <div className="h-2 w-2 rounded-full bg-cricket-600"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => navigate('/rewards')}
                    className="mt-4 bg-cricket-600 hover:bg-cricket-700"
                  >
                    Learn More About Rewards
                  </Button>
                </div>
                
                <div className="lg:pl-8">
                  <div className="max-w-md mx-auto">
                    <PointsCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* App Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose CricketInn?
              </h2>
              <p className="text-lg text-gray-600">
                We're revolutionizing how cricket fans book tickets and experience matches
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Seamless Booking",
                  description: "Book tickets in just a few clicks with our intuitive interface and secure payment system.",
                  icon: "https://via.placeholder.com/48?text=🎫",
                },
                {
                  title: "Rewards System",
                  description: "Earn points with every purchase and redeem them for exclusive rewards and experiences.",
                  icon: "https://via.placeholder.com/48?text=🏆",
                },
                {
                  title: "Premium Experience",
                  description: "Choose from various seat categories and enjoy premium services at the stadium.",
                  icon: "https://via.placeholder.com/48?text=⭐",
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover-scale"
                >
                  <div className="w-12 h-12 bg-cricket-50 rounded-xl flex items-center justify-center mb-4">
                    <img src={feature.icon} alt={feature.title} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cricket-600 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Cricket Like Never Before?</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Join thousands of fans who are already enjoying premium cricket experiences and rewards.
              </p>
              <Button 
                onClick={() => navigate('/sign-up')}
                size="lg" 
                variant="secondary" 
                className="bg-white text-cricket-600 hover:bg-white/90 hover:text-cricket-700 h-12 px-8"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <button
        className="fixed bottom-6 left-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        onClick={toggleChatbot}
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default Index;
