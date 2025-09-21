import { Card, CardContent } from '@/components/ui/card';
import { Trophy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinnerCardProps {
  winnerName: string;
  winnerImageUrl: string;
  sponsorName: string;
  giftTitle: string;
  giftDescription: string;
  sponsorWebsite: string;
}

export default function WinnerCard({
  winnerName,
  winnerImageUrl,
  sponsorName,
  giftTitle,
  giftDescription,
  sponsorWebsite
}: WinnerCardProps) {
  const handleSponsorClick = () => {
    console.log('Sponsor website clicked:', sponsorWebsite);
    window.open(sponsorWebsite, '_blank');
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid="winner-card">
      <CardContent className="p-0">
        {/* Winner Image */}
        <div className="relative aspect-[3/4] w-full">
          <img 
            src={winnerImageUrl} 
            alt={`Winner: ${winnerName}`}
            className="w-full h-full object-cover"
            data-testid="img-winner-main"
          />
          
          {/* Winner Badge Overlay */}
          <div className="absolute top-4 left-4 bg-chart-1 text-white px-3 py-1 rounded-full flex items-center gap-2 font-semibold text-sm">
            <Trophy className="w-4 h-4" />
            <span>Winner</span>
          </div>
        </div>
        
        {/* Card Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg mb-1" data-testid="text-winner-card-name">
              {winnerName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Won: <span className="font-semibold text-foreground" data-testid="text-gift-won">
                {giftTitle}
              </span>
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground" data-testid="text-gift-desc-winner">
              {giftDescription}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Sponsored by: <span className="text-foreground" data-testid="text-sponsor-winner">
                  {sponsorName}
                </span>
              </span>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSponsorClick}
                data-testid="button-sponsor-winner"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Event Over
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}