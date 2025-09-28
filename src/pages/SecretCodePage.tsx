import { useLocation } from 'wouter';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { type Campaign } from '@shared/schema';
import SecretCodeReveal from '@/components/SecretCodeReveal';
import ThemeToggle from '@/components/ThemeToggle';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useState, useEffect } from 'react';

interface CampaignWithDate extends Campaign {
  countdownEnd: Date;
  createdAt: Date;
}

export default function SecretCodePage() {
  const [, setLocation] = useLocation();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  const handleReveal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsAnimating(false);
    }, 1500); // Match the animation duration in SecretCodeReveal
  };

  // Fetch active campaign
  const { data: activeCampaigns = [], isLoading } = useQuery<CampaignWithDate[]>({
    queryKey: ['campaigns', 'active'],
    queryFn: async () => {
      const campaignsRef = collection(firestore, 'campaigns');
      const q = query(campaignsRef, where("active", "==", true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Campaign;
        return {
          ...data,
          id: doc.id,
          countdownEnd: data.countdownEnd ? data.countdownEnd.toDate() : new Date(),
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });
    },
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  const activeCampaign = activeCampaigns.length > 0 ? activeCampaigns[0] : undefined;

  useEffect(() => {
    if (!isLoading && activeCampaign && !isRevealed && !isAnimating) {
      handleReveal();
    }
  }, [isLoading, activeCampaign, isRevealed, isAnimating, handleReveal]);

  return (
    <div className="h-screen w-screen bg-background">
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
      <main className="h-full w-full pt-16 sm:pt-20 flex p-2 sm:p-4 overflow-y-auto pb-20">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg m-auto">
          {(isLoading || isAnimating) ? (
            <div className="text-center p-8">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-primary mb-3 sm:mb-4 animate-spin" />
              <p className="text-sm sm:text-base md:text-lg font-semibold text-muted-foreground">
                {isLoading ? 'Loading campaign...' : 'Revealing Secret Code...'}
              </p>
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
              secretCode={activeCampaign.secretCode}
              sponsorName={activeCampaign.sponsorName}
              sponsorTagline={activeCampaign.sponsorTagline}
              posterUrl={activeCampaign.posterUrl}
              sponsorWebsite={activeCampaign.sponsorWebsite}
              mysteryDescription={activeCampaign.mysteryDescription}
              isRevealed={isRevealed}
              isAnimating={isAnimating}
              onReveal={handleReveal}
              campaignEndDate={activeCampaign.countdownEnd}
              winnerImageUrl={activeCampaign.winnerImageUrl}
            />
          )}
        </div>
      </main>
    </div>
  );
}