
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

interface SeatCategory {
  id: string;
  name: string;
  price: number;
  availableSeats: number;
  color: string;
  pointsEarned: number;
}

interface SeatSelectionProps {
  matchId: string;
  categories: SeatCategory[];
  onSeatSelect: (selectedSeats: {
    category: SeatCategory;
    count: number;
  }) => void;
}

const SeatSelection = ({ matchId, categories, onSeatSelect }: SeatSelectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<SeatCategory | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(1);
  
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);
  
  useEffect(() => {
    if (selectedCategory) {
      setSelectedCount(1);
    }
  }, [selectedCategory]);
  
  const getCategoryBgColor = (category: SeatCategory) => {
    const isSelected = selectedCategory?.id === category.id;
    switch (category.color) {
      case 'gold':
        return isSelected ? 'bg-amber-100 border-amber-300' : 'border-amber-200 hover:bg-amber-50';
      case 'silver':
        return isSelected ? 'bg-gray-100 border-gray-300' : 'border-gray-200 hover:bg-gray-50';
      case 'bronze':
        return isSelected ? 'bg-orange-100 border-orange-300' : 'border-orange-200 hover:bg-orange-50';
      case 'platinum':
        return isSelected ? 'bg-indigo-100 border-indigo-300' : 'border-indigo-200 hover:bg-indigo-50';
      default:
        return isSelected ? 'bg-blue-100 border-blue-300' : 'border-blue-200 hover:bg-blue-50';
    }
  };
  
  const handleCategorySelect = (category: SeatCategory) => {
    setSelectedCategory(category);
  };
  
  const handleCountChange = (count: number) => {
    if (selectedCategory) {
      const newCount = Math.max(1, Math.min(count, selectedCategory.availableSeats));
      setSelectedCount(newCount);
    }
  };
  
  const handleSeatSelect = () => {
    if (selectedCategory) {
      onSeatSelect({
        category: selectedCategory,
        count: selectedCount,
      });
    }
  };
  
  if (!selectedCategory) return null;
  
  const totalPrice = selectedCategory.price * selectedCount;
  const totalPoints = selectedCategory.pointsEarned * selectedCount;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Seat Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${getCategoryBgColor(category)} flex flex-col h-full text-left`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900">{category.name}</span>
                {selectedCategory?.id === category.id && (
                  <div className="bg-cricket-600 rounded-full p-1">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="text-lg font-bold text-cricket-700 mb-1">
                ₹{(category.price).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Earn {category.pointsEarned} points per seat
              </div>
              <div className="mt-auto">
                {category.availableSeats > 0 ? (
                  <Badge variant="outline" className="bg-white/50">
                    {category.availableSeats} seats available
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Sold Out
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of Seats</h3>
        <div className="flex items-center justify-between max-w-xs mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCountChange(selectedCount - 1)}
            disabled={selectedCount <= 1}
          >
            -
          </Button>
          <span className="text-xl font-medium text-gray-900 w-12 text-center">
            {selectedCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleCountChange(selectedCount + 1)}
            disabled={selectedCount >= selectedCategory.availableSeats}
          >
            +
          </Button>
        </div>
        
        {selectedCategory.availableSeats < 5 && selectedCategory.availableSeats > 0 && (
          <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-2 rounded-md text-sm mb-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            Only {selectedCategory.availableSeats} seats left in this category
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 pt-6">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Price per seat</span>
            <span className="font-medium">₹{selectedCategory.price.toFixed(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of seats</span>
            <span className="font-medium">x {selectedCount}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="font-semibold text-gray-900">Total Price</span>
            <span className="font-bold text-cricket-700">₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Points you'll earn</span>
            <span className="font-medium text-cricket-600">+{totalPoints} points</span>
          </div>
        </div>
        
        <Button 
          onClick={handleSeatSelect}
          className="w-full bg-cricket-600 hover:bg-cricket-700"
          disabled={selectedCategory.availableSeats === 0}
        >
          {selectedCategory.availableSeats === 0 
            ? 'Sold Out' 
            : `Book ${selectedCount} ${selectedCount === 1 ? 'Seat' : 'Seats'}`}
        </Button>
      </div>
    </div>
  );
};

export default SeatSelection;
