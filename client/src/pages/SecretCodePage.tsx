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
    sponsorTagline: "Revolutionizing Digital Innovation"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">
            Secret Code
          </h1>
        </div>
        
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Secret Code Section - 70% */}
        <section className="flex-1 lg:flex-[7] flex items-center justify-center p-4">
          <SecretCodeReveal
            secretCode={mockData.secretCode}
            sponsorName={mockData.sponsorName}
            sponsorTagline={mockData.sponsorTagline}
          />
        </section>

        {/* Sponsor Details - 30% */}
        <section className="lg:flex-[3] p-4 bg-muted/20 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {mockData.sponsorName.charAt(0)}
              </span>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2" data-testid="text-sponsor-details-name">
                {mockData.sponsorName}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-sponsor-details-tagline">
                {mockData.sponsorTagline}
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground pt-4 border-t">
              <p>Tell this code to VideoWalker</p>
              <p>to claim your prize!</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}