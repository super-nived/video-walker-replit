import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Sparkles, Clock, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { type Campaign } from '@shared/schema';
import ThemeToggle from '@/components/ThemeToggle';
import sponsorPoster from '@assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png';

interface CampaignWithDate extends Campaign {
  countdownEnd: Date;
  createdAt: Date;
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  
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
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const activeCampaign = activeCampaigns.length > 0 ? activeCampaigns[0] : undefined;

  // Fallback data for when no campaign is active
  const fallbackAd = {
    posterUrl: sponsorPoster,
    sponsorName: "TechFlow Pro",
    sponsorTagline: "Revolutionizing Digital Innovation",
    sponsorWebsite: "https://example.com",
    mysteryDescription: "🎁 Mystery Prize Awaits! Be the first to tell VideoWalker this secret code and win an amazing surprise gift worth over $200!",
    prizeValue: "$200+"
  };

  const campaign = activeCampaign || fallbackAd;

  const handleSponsorClick = () => {
    console.log('Sponsor website clicked:', campaign.sponsorWebsite);
    window.open(campaign.sponsorWebsite, '_blank');
  };

  const handleAdminClick = () => {
    console.log('Navigating to admin page');
    setLocation('/admin');
  };

  const handleFindSecretCode = () => {
    console.log('Navigating to secret code page');
    setLocation('/secret-code');
  };

  return (
    <div className="w-screen bg-background overflow-y-auto">
      {/* Floating Header - Responsive sizing */}
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-2 sm:p-4 bg-background/80 backdrop-blur-sm">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold text-primary truncate" data-testid="text-app-title">
            VideoWalker
          </h1>
          <p className="text-xs text-muted-foreground hidden xs:block">
            Watch. Reveal. Win.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdminClick}
            className="p-2 hover-elevate"
            data-testid="button-admin"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Full Screen Layout with scrolling */}
      <main className="h-full w-full flex flex-col pt-[60px] sm:pt-[72px] pb-20">
        {/* Top 70% - Sponsor Poster - Responsive adjustments */}
        <section 
          className="h-[70svh] w-full relative cursor-pointer group overflow-hidden"
          onClick={handleSponsorClick}
          data-testid="sponsor-poster-section"
        >
          {isLoading ? (
            <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
              <p className="text-muted-foreground">Loading campaign...</p>
            </div>
          ) : (
            <img 
              src={campaign.posterUrl} 
              alt={`${campaign.sponsorName} advertisement`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          
          {/* Overlay with sponsor info - Responsive text and spacing */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-2 sm:left-4 md:left-6 right-2 sm:right-4 md:right-6">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2" data-testid="text-sponsor-name">
                {campaign.sponsorName}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2" data-testid="text-sponsor-tagline">
                {campaign.sponsorTagline}
              </p>
              
              {/* Campaign status and countdown */}
              {activeCampaign && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-100 px-2 py-1 rounded text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                  {activeCampaign.countdownEnd && new Date(activeCampaign.countdownEnd) > new Date() && (
                    <div className="flex items-center gap-1 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-100 px-2 py-1 rounded text-xs">
                      <Clock className="w-3 h-3" />
                      <span>
                        {Math.floor((new Date(activeCampaign.countdownEnd).getTime() - new Date().getTime()) / (1000 * 60))}m left
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm min-h-[44px]"
                data-testid="button-sponsor-website"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Visit Website</span>
                <span className="xs:hidden">Visit</span>
              </Button>
            </div>
          </div>

          {/* Hover Play Icon - Responsive sizing */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </section>

        {/* Bottom 30% - Mystery Gift Instructions - Super responsive */}
        <section className="flex-grow w-full bg-gradient-to-br from-primary/5 to-chart-3/5 flex items-center justify-center p-2 sm:p-4 md:p-6">
          <Card className="w-full border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover-elevate">
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-primary to-chart-3 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-1 sm:mb-2">
                  {activeCampaign ? 
                    `Win ${activeCampaign.prizeValue || 'an Amazing Prize'}!` : 
                    '🎁 Mystery Prize Awaits!'
                  }
                </h3>
                {activeCampaign && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {activeCampaign.mysteryDescription}
                  </p>
                )}
              </div>

              {/* Interactive Steps - Responsive spacing and text */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors min-h-[44px]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold">🔑</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Find the secret code</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-chart-2/5 hover:bg-chart-2/10 transition-colors min-h-[44px]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold">🎤</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Say it to VideoWalker</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-chart-1/5 hover:bg-chart-1/10 transition-colors min-h-[44px]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs sm:text-sm font-bold">🎁</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium">Get the gift</span>
                </div>
              </div>

              <Button 
                onClick={handleFindSecretCode}
                className="w-full bg-gradient-to-r from-primary to-chart-3 hover:from-primary/90 hover:to-chart-3/90 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-find-secret-code"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {!activeCampaign ? 'No Active Campaign' : 'Find Secret Code'}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}