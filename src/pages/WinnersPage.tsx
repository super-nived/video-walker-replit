import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WinnerCard from '@/components/WinnerCard';
import ThemeToggle from '@/components/ThemeToggle';
import winnerImage from '@assets/generated_images/Happy_winner_celebration_85eef4f3.png';
import giftImage from '@assets/generated_images/Premium_headphones_gift_e7a81b00.png';

export default function WinnersPage() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  // Mock data - todo: remove mock functionality
  const mockWinners = [
    {
      id: "1",
      winnerName: "Sarah Johnson",
      winnerImageUrl: winnerImage,
      sponsorName: "TechFlow Pro",
      giftTitle: "Premium Wireless Headphones",
      giftDescription: "High-quality noise-canceling headphones with 30-hour battery life",
      sponsorWebsite: "https://example.com"
    },
    {
      id: "2", 
      winnerName: "Mike Chen",
      winnerImageUrl: winnerImage,
      sponsorName: "GameZone Elite",
      giftTitle: "Gaming Mechanical Keyboard",
      giftDescription: "RGB mechanical gaming keyboard with custom switches",
      sponsorWebsite: "https://example.com"
    },
    {
      id: "3",
      winnerName: "Emma Rodriguez",
      winnerImageUrl: winnerImage,
      sponsorName: "FitTech Solutions",
      giftTitle: "Smart Fitness Watch",
      giftDescription: "Advanced fitness tracking with heart rate monitor",
      sponsorWebsite: "https://example.com"
    },
    {
      id: "4",
      winnerName: "Alex Thompson",
      winnerImageUrl: winnerImage,
      sponsorName: "AudioMax Pro",
      giftTitle: "Professional Microphone",
      giftDescription: "Studio-grade microphone for content creators",
      sponsorWebsite: "https://example.com"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
          data-testid="button-back-home-winners"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">
            Past Winners
          </h1>
          <p className="text-sm text-muted-foreground">
            Hall of Fame
          </p>
        </div>
        
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Winners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="winners-grid">
            {mockWinners.map((winner) => (
              <WinnerCard
                key={winner.id}
                winnerName={winner.winnerName}
                winnerImageUrl={winner.winnerImageUrl}
                sponsorName={winner.sponsorName}
                giftTitle={winner.giftTitle}
                giftDescription={winner.giftDescription}
                sponsorWebsite={winner.sponsorWebsite}
              />
            ))}
          </div>
          
          {/* Empty State */}
          {mockWinners.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Winners Yet</h3>
              <p className="text-muted-foreground">
                Be the first to win a prize!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}