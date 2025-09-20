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
      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-lg font-bold text-primary">
            Secret Code Revealed
          </h1>
        </div>
        
        <ThemeToggle />
      </header>

      {/* Full Screen Main Content */}
      <main className="h-full w-full pt-20 flex items-center justify-center">
        <SecretCodeReveal
          secretCode={mockData.secretCode}
          sponsorName={mockData.sponsorName}
          sponsorTagline={mockData.sponsorTagline}
          mysteryDescription={mockData.mysteryDescription}
        />
      </main>
    </div>
  );
}