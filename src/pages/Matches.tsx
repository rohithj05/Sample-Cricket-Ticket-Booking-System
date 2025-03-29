
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarIcon, 
  Filter, 
  X, 
  Search as SearchIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import { 
  useMatches, 
  filterMatchesByType, 
  filterMatchesByTeam, 
  Match 
} from '@/hooks/useMatches';

const Matches = () => {
  const navigate = useNavigate();
  const { data: allMatches, isLoading } = useMatches();
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'T20' | 'ODI' | 'Test' | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  useEffect(() => {
    if (allMatches) {
      let result = [...allMatches];
      
      // Filter by match type
      if (selectedType) {
        result = filterMatchesByType(result, selectedType);
      }
      
      // Filter by search term (team name)
      if (searchTerm) {
        result = filterMatchesByTeam(result, searchTerm);
      }
      
      setFilteredMatches(result);
    }
  }, [allMatches, selectedType, searchTerm]);
  
  const resetFilters = () => {
    setSelectedType(undefined);
    setSearchTerm('');
  };
  
  const hasActiveFilters = !!selectedType || !!searchTerm;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Header */}
        <section className="bg-cricket-600 py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Cricket Matches</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Browse and book tickets for upcoming cricket matches around the world
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Input
                  type="text"
                  placeholder="Search for teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white/10 placeholder:text-white/60 text-white border-white/20 focus-visible:ring-white/30"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Filters */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 md:flex md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <div className={`${isFilterOpen ? 'flex' : 'hidden'} md:flex items-center space-x-4 mt-4 md:mt-0`}>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2 whitespace-nowrap">Match Type:</span>
                    <Select
                      value={selectedType || "all"}
                      onValueChange={(value) => setSelectedType(value === "all" ? undefined : value as any)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="T20">T20</SelectItem>
                        <SelectItem value="ODI">ODI</SelectItem>
                        <SelectItem value="Test">Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-4">
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear filters
                  </Button>
                )}
                <span className="text-sm text-gray-500">
                  Showing {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Matches Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="h-[420px] bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredMatches.map((match) => (
                  <MatchCard key={match.id} {...match} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-500 mb-6">
                  {hasActiveFilters 
                    ? "Try adjusting your filters to see more results" 
                    : "There are no upcoming matches at the moment"}
                </p>
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Matches;
