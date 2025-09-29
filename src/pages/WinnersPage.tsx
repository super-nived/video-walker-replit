import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WinnerCard from '@/components/WinnerCard';
import ThemeToggle from '@/components/ThemeToggle';
import winnerImage from '../../attached_assets/generated_images/Happy_winner_celebration_85eef4f3.png';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { type Campaign } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function WinnersPage() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  const { data: winners = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['winners'],
    queryFn: async () => {
      const campaignsRef = collection(firestore, 'campaigns');
      const q1 = query(campaignsRef, where("winnerImageUrl", "!=", null));
      const q2 = query(campaignsRef, where("hasWinner", "==", true));

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2),
      ]);

      const winnersMap = new Map<string, Campaign>();

      querySnapshot1.docs.forEach(doc => {
        const campaign = { ...doc.data(), id: doc.id } as Campaign;
        winnersMap.set(campaign.id, campaign);
      });

      querySnapshot2.docs.forEach(doc => {
        const campaign = { ...doc.data(), id: doc.id } as Campaign;
        winnersMap.set(campaign.id, campaign);
      });

      return Array.from(winnersMap.values());
    },
  });

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
      <main className="p-4 mb-20">
        <div className="max-w-6xl mx-auto">
          {/* Winners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="winners-grid">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              winners.map((winner) => (
                <WinnerCard
                  key={winner.id}
                  winnerName={winner.sponsorName} // Using sponsorName as a placeholder for winnerName
                  winnerImageUrl={winner.winnerImageUrl || winnerImage}
                  sponsorName={winner.sponsorName}
                  giftTitle={winner.mysteryDescription}
                  giftDescription={winner.mysteryDescription}
                  sponsorWebsite={winner.sponsorWebsite}
                />
              ))
            )}
          </div>
          
          {/* Empty State */}
          {!isLoading && winners.length === 0 && (
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