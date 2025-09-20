import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import SponsorAdCard from '@/components/SponsorAdCard';
import GiftSection from '@/components/GiftSection';
import ThemeToggle from '@/components/ThemeToggle';
import sponsorPoster from '@assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png';
import giftImage from '@assets/generated_images/Premium_headphones_gift_e7a81b00.png';
import winnerImage from '@assets/generated_images/Happy_winner_celebration_85eef4f3.png';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [isCountdownExpired, setIsCountdownExpired] = useState(false);
  
  // Mock data - todo: remove mock functionality
  const mockAd = {
    posterUrl: sponsorPoster,
    sponsorName: "TechFlow Pro",
    sponsorTagline: "Revolutionizing Digital Innovation",
    sponsorWebsite: "https://example.com",
    giftTitle: "Premium Wireless Headphones",
    giftDescription: "High-quality noise-canceling headphones with 30-hour battery life and premium comfort",
    giftImageUrl: giftImage,
    countdownEnd: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    hasWinner: false,
    winnerName: "Sarah Johnson",
    winnerImageUrl: winnerImage
  };

  const handleRevealCode = () => {
    console.log('Navigating to secret code page');
    setLocation('/secret-code');
  };

  const handleCountdownComplete = () => {
    console.log('Countdown completed');
    setIsCountdownExpired(true);
  };

  useEffect(() => {
    // Check if countdown should be expired on mount
    if (mockAd.countdownEnd.getTime() <= Date.now()) {
      setIsCountdownExpired(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-primary" data-testid="text-app-title">
            VideoWalker
          </h1>
          <p className="text-sm text-muted-foreground">
            Watch. Reveal. Win.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content - Mobile First 70/30 Layout */}
      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Sponsor Ad Section - 70% on mobile (full width), 70% on desktop */}
        <section className="flex-1 lg:flex-[7] p-4" data-testid="sponsor-section">
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-sm lg:max-w-md">
              <SponsorAdCard
                posterUrl={mockAd.posterUrl}
                sponsorName={mockAd.sponsorName}
                sponsorTagline={mockAd.sponsorTagline}
                sponsorWebsite={mockAd.sponsorWebsite}
              />
            </div>
          </div>
        </section>

        {/* Gift Section - 30% on mobile (full width), 30% on desktop */}
        <section className="lg:flex-[3] p-4 bg-muted/20" data-testid="gift-section-main">
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-md">
              <GiftSection
                giftTitle={mockAd.giftTitle}
                giftDescription={mockAd.giftDescription}
                giftImageUrl={mockAd.giftImageUrl}
                countdownEnd={mockAd.countdownEnd}
                hasWinner={mockAd.hasWinner}
                winnerName={mockAd.winnerName}
                winnerImageUrl={mockAd.winnerImageUrl}
                onRevealCode={handleRevealCode}
                isCountdownExpired={isCountdownExpired}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}