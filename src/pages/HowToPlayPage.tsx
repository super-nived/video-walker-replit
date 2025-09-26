import { useLocation } from 'wouter';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';

export default function HowToPlayPage() {
  const [, setLocation] = useLocation();

  const handleBackClick = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">
            How to Play
          </h1>
        </div>
        
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="p-4 mb-20">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                Welcome to VideoWalker!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                VideoWalker is an exciting game where you can win amazing prizes by watching sponsor ads and being quick!
              </p>
              
              <h3 className="text-lg font-semibold mb-2">1. Watch & Earn</h3>
              <p className="text-muted-foreground mb-4">
                Keep an eye out for new sponsor advertisements. Watch them completely to participate in the campaign.
              </p>
              {/* Suggested Image: ad_watching_screenshot.png */}

              <h3 className="text-lg font-semibold mb-2">2. Reveal the Secret Code</h3>
              <p className="text-muted-foreground mb-4">
                Each campaign has a secret code that will be revealed after a countdown. Make sure you're ready when the time comes!
              </p>
              {/* Suggested Image: secret_code_reveal_screenshot.png */}

              <h3 className="text-lg font-semibold mb-2">3. Be the First to Claim</h3>
              <p className="text-muted-foreground mb-4">
                Once the secret code is revealed, be the very first person to tell it to the VideoWalker system (or designated admin) to claim your prize!
              </p>
              {/* Suggested Image: claim_prize_screenshot.png */}

              <h3 className="text-lg font-semibold mb-2">4. Win Amazing Prizes!</h3>
              <p className="text-muted-foreground mb-4">
                If you're the first, you win the mystery prize associated with that campaign. Good luck!
              </p>
              {/* Suggested Image: prize_collage.png */}

              <p className="text-sm text-primary font-semibold mt-6">
                Stay tuned for new campaigns and more chances to win!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}