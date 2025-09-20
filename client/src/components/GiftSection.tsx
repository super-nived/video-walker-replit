import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Trophy } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

interface GiftSectionProps {
  giftTitle: string;
  giftDescription: string;
  giftImageUrl: string;
  countdownEnd: Date;
  hasWinner: boolean;
  winnerName?: string;
  winnerImageUrl?: string;
  onRevealCode: () => void;
  isCountdownExpired: boolean;
}

export default function GiftSection({
  giftTitle,
  giftDescription,
  giftImageUrl,
  countdownEnd,
  hasWinner,
  winnerName,
  winnerImageUrl,
  onRevealCode,
  isCountdownExpired
}: GiftSectionProps) {
  const handleRevealClick = () => {
    console.log('Reveal secret code clicked');
    onRevealCode();
  };

  return (
    <Card className="p-4" data-testid="gift-section">
      <CardContent className="p-0">
        <div className="flex gap-4">
          {/* Gift Image */}
          <div className="w-24 h-24 flex-shrink-0">
            <img 
              src={giftImageUrl} 
              alt={giftTitle}
              className="w-full h-full object-cover rounded-md"
              data-testid="img-gift"
            />
          </div>
          
          {/* Gift Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg truncate" data-testid="text-gift-title">
                {giftTitle}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid="text-gift-description">
              {giftDescription}
            </p>
            
            {/* Winner Display */}
            {hasWinner && winnerName && winnerImageUrl ? (
              <div className="bg-chart-1/10 border border-chart-1/20 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={winnerImageUrl} 
                    alt={winnerName}
                    className="w-10 h-10 rounded-full object-cover"
                    data-testid="img-winner"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-chart-1" />
                      <span className="font-semibold text-chart-1">Winner!</span>
                    </div>
                    <p className="text-sm font-medium" data-testid="text-winner-name">
                      {winnerName}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Countdown & Button */
              <div className="space-y-3">
                {!isCountdownExpired ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Secret code reveals in:
                    </p>
                    <CountdownTimer targetDate={countdownEnd} />
                  </div>
                ) : (
                  <Button 
                    onClick={handleRevealClick}
                    className="w-full bg-gradient-to-r from-primary to-chart-3 hover:from-primary/90 hover:to-chart-3/90"
                    data-testid="button-reveal-code"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Reveal Secret Code
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}