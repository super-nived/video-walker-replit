import { Card, CardContent } from '@/components/ui/card';
import { Trophy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinnerCardProps {
  winnerName: string;
  winnerImageUrl: string;
  sponsorName: string;
  sponsorWebsite: string;
  mainImageUrl: string;
  prizeValue: string;
}

export default function WinnerCard({
  winnerName,
  winnerImageUrl,
  sponsorName,
  sponsorWebsite,
  mainImageUrl,
  prizeValue,
}: WinnerCardProps) {
  const handleSponsorClick = () => {
    window.open(sponsorWebsite, '_blank');
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid="winner-card">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <img 
            src={mainImageUrl} 
            alt={`Sponsor: ${sponsorName}`}
            className="w-full h-full object-cover"
            data-testid="img-sponsor-main"
          />
          
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
            {winnerImageUrl ? (
              <img 
                src={winnerImageUrl} 
                alt={`Winner: ${winnerName}`}
                className="w-full h-full object-cover"
                data-testid="img-winner-avatar"
              />
            ) : (
              <Trophy className="w-8 h-8 text-gray-500" />
            )}
          </div>

          <div className="absolute top-4 left-4 bg-chart-1 text-white px-3 py-1 rounded-full flex items-center gap-2 font-semibold text-sm">
            <Trophy className="w-4 h-4" />
            <span>Winner</span>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg mb-1" data-testid="text-winner-card-name">
              {winnerName}
            </h3>
            {prizeValue && (
              <p className="text-sm text-muted-foreground">
                Won: <span className="font-semibold text-foreground" data-testid="text-gift-won">
                  {prizeValue}
                </span>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
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