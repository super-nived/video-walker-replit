import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Play, Sparkles } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import sponsorPoster from '@assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png';

export default function HomePage() {
  const [, setLocation] = useLocation();
  
  // Mock data - todo: remove mock functionality
  const mockAd = {
    posterUrl: sponsorPoster,
    sponsorName: "TechFlow Pro",
    sponsorTagline: "Revolutionizing Digital Innovation",
    sponsorWebsite: "https://example.com"
  };

  const handleSponsorClick = () => {
    console.log('Sponsor website clicked:', mockAd.sponsorWebsite);
    window.open(mockAd.sponsorWebsite, '_blank');
  };

  const handleFindSecretCode = () => {
    console.log('Navigating to secret code page');
    setLocation('/secret-code');
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <div>
          <h1 className="text-xl font-bold text-primary" data-testid="text-app-title">
            VideoWalker
          </h1>
          <p className="text-xs text-muted-foreground">
            Watch. Reveal. Win.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Full Screen Layout */}
      <main className="h-full w-full flex flex-col">
        {/* Top 70% - Sponsor Poster */}
        <section 
          className="h-[70%] w-full relative cursor-pointer group overflow-hidden"
          onClick={handleSponsorClick}
          data-testid="sponsor-poster-section"
        >
          <img 
            src={mockAd.posterUrl} 
            alt={`${mockAd.sponsorName} advertisement`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay with sponsor info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-white text-2xl font-bold mb-2" data-testid="text-sponsor-name">
                {mockAd.sponsorName}
              </h2>
              <p className="text-white/90 text-sm mb-4" data-testid="text-sponsor-tagline">
                {mockAd.sponsorTagline}
              </p>
              
              <Button
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                data-testid="button-sponsor-website"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
              </Button>
            </div>
          </div>

          {/* Hover Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </section>

        {/* Bottom 30% - Mystery Gift Instructions */}
        <section className="h-[30%] w-full bg-gradient-to-br from-primary/5 to-chart-3/5 flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover-elevate">
            <CardContent className="p-6 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-chart-3 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  🎁 Mystery Prize Awaits!
                </h3>
              </div>

              {/* Interactive Steps */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold">🔑</span>
                  </div>
                  <span className="text-sm font-medium">Find the secret code</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-2/5 hover:bg-chart-2/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                    <span className="text-sm font-bold">🎤</span>
                  </div>
                  <span className="text-sm font-medium">Say it to VideoWalker</span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-chart-1/5 hover:bg-chart-1/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <span className="text-sm font-bold">🎁</span>
                  </div>
                  <span className="text-sm font-medium">Get the gift</span>
                </div>
              </div>

              <Button 
                onClick={handleFindSecretCode}
                className="w-full bg-gradient-to-r from-primary to-chart-3 hover:from-primary/90 hover:to-chart-3/90 text-white font-semibold py-3"
                data-testid="button-find-secret-code"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Find Secret Code
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}