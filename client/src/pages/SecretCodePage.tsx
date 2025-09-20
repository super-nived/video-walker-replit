import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { type Campaign } from '@shared/schema';
import SecretCodeReveal from '@/components/SecretCodeReveal';
import ThemeToggle from '@/components/ThemeToggle';

export default function SecretCodePage() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  // Fetch active campaign
  const { data: activeCampaign, isLoading } = useQuery<Campaign>({
    queryKey: ['/api/campaigns/active'],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  // Fallback data for when no campaign is active
  const fallbackData = {
    secretCode: "TECH2024WIN",
    sponsorName: "TechFlow Pro",
    sponsorTagline: "Revolutionizing Digital Innovation",
    mysteryDescription: "🎁 Mystery Prize Awaits! Be the first to tell VideoWalker this secret code and win an amazing surprise gift worth over $200!"
  };

  const campaign = activeCampaign || fallbackData;

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
          {isLoading ? (
            <div className="text-center p-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading campaign...</p>
            </div>
          ) : !activeCampaign ? (
            <div className="text-center p-8">
              <h2 className="text-xl font-bold text-muted-foreground mb-4">No Active Campaign</h2>
              <p className="text-muted-foreground mb-6">There are currently no active campaigns. Check back later!</p>
              <Button onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          ) : activeCampaign.hasWinner ? (
            <div className="text-center p-8">
              <h2 className="text-xl font-bold text-green-600 mb-4">🎉 Winner Already Selected!</h2>
              <p className="text-muted-foreground mb-6">This campaign already has a winner. Stay tuned for the next campaign!</p>
              <Button onClick={handleBackClick}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          ) : (
            <SecretCodeReveal
              campaignId={activeCampaign.id}
              secretCode={campaign.secretCode}
              sponsorName={campaign.sponsorName}
              sponsorTagline={campaign.sponsorTagline}
              mysteryDescription={campaign.mysteryDescription}
            />
          )}
        </div>
      </main>
    </div>
  );
}