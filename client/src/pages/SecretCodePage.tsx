import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SecretCodeReveal from '@/components/SecretCodeReveal';
import ThemeToggle from '@/components/ThemeToggle';

export default function SecretCodePage() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  // Mock data - todo: remove mock functionality
  const mockData = {
    secretCode: "TECH2024WIN",
    sponsorName: "TechFlow Pro",
    sponsorTagline: "Revolutionizing Digital Innovation",
    mysteryDescription: "🎁 Mystery Prize Awaits! Be the first to tell VideoWalker this secret code and win an amazing surprise gift worth over $200!"
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Floating Header - Super responsive */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-2 sm:p-4 bg-background/80 backdrop-blur-sm border-b">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBackClick}
          className="flex items-center gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Back</span>
          <span className="xs:hidden">←</span>
        </Button>
        
        <div className="text-center min-w-0 flex-1 mx-2 sm:mx-4">
          <h1 className="text-sm sm:text-lg font-bold text-primary truncate">
            Secret Code Revealed
          </h1>
        </div>
        
        <div className="flex-shrink-0">
          <ThemeToggle />
        </div>
      </header>

      {/* Full Screen Main Content - Super responsive padding */}
      <main className="h-full w-full pt-16 sm:pt-20 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <SecretCodeReveal
            secretCode={mockData.secretCode}
            sponsorName={mockData.sponsorName}
            sponsorTagline={mockData.sponsorTagline}
            mysteryDescription={mockData.mysteryDescription}
          />
        </div>
      </main>
    </div>
  );
}