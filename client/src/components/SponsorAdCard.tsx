import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface SponsorAdCardProps {
  posterUrl: string;
  sponsorName: string;
  sponsorTagline: string;
  sponsorWebsite: string;
}

export default function SponsorAdCard({ 
  posterUrl, 
  sponsorName, 
  sponsorTagline, 
  sponsorWebsite 
}: SponsorAdCardProps) {
  const handleSponsorClick = () => {
    console.log('Sponsor website clicked:', sponsorWebsite);
    window.open(sponsorWebsite, '_blank');
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid="sponsor-ad-card">
      <div className="relative aspect-[3/4] w-full">
        <img 
          src={posterUrl} 
          alt={`${sponsorName} advertisement`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Sponsor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-bold text-lg mb-1" data-testid="text-sponsor-name">
            {sponsorName}
          </h3>
          <p className="text-white/90 text-sm mb-3" data-testid="text-sponsor-tagline">
            {sponsorTagline}
          </p>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleSponsorClick}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            data-testid="button-sponsor-website"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </div>
    </Card>
  );
}