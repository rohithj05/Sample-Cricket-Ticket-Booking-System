
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Ticket, Trophy, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Matches', path: '/matches', icon: <Ticket className="w-4 h-4 mr-2" /> },
    { name: 'Rewards', path: '/rewards', icon: <Trophy className="w-4 h-4 mr-2" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-4 h-4 mr-2" /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            <span className="bg-cricket-600 text-white p-1 rounded">CI</span>
            <span className={`transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>CricketInn</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-2 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-cricket-600 bg-cricket-50'
                    : 'text-gray-600 hover:text-cricket-600 hover:bg-cricket-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="ml-4 flex items-center space-x-2">
              {user ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="font-medium"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button size="sm" className="font-medium bg-cricket-600 hover:bg-cricket-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 pt-2 pb-8 space-y-3 bg-white/90 backdrop-blur-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center p-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-cricket-600 bg-cricket-50'
                    : 'text-gray-600 hover:text-cricket-600 hover:bg-cricket-50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-2">
              {user ? (
                <Button 
                  variant="outline" 
                  className="w-full font-medium"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/sign-in" className="w-full">
                    <Button variant="outline" className="w-full font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="w-full">
                    <Button className="w-full font-medium bg-cricket-600 hover:bg-cricket-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
