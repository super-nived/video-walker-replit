import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecretCodeRevealProps {
  secretCode: string;
  sponsorName: string;
  sponsorTagline: string;
  mysteryDescription?: string;
}

export default function SecretCodeReveal({ 
  secretCode, 
  sponsorName, 
  sponsorTagline,
  mysteryDescription 
}: SecretCodeRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const handleReveal = () => {
    console.log('Revealing secret code:', secretCode);
    setIsAnimating(true);
    
    // Simulate reveal animation
    setTimeout(() => {
      setIsRevealed(true);
      setIsAnimating(false);
    }, 1500);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(secretCode);
      toast({
        title: "Code Copied!",
        description: "Secret code copied to clipboard",
      });
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    // Auto-reveal after component mounts (simulating page load)
    const timer = setTimeout(handleReveal, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full mx-auto p-2 sm:p-3 md:p-4" data-testid="secret-code-reveal">
      {/* Secret Code Section - Super responsive */}
      <Card className="mb-4 sm:mb-6 overflow-hidden">
        <CardContent className="p-4 sm:p-6 md:p-8 text-center bg-gradient-to-br from-primary/5 to-chart-3/5">
          {!isRevealed ? (
            <div className="space-y-3 sm:space-y-4">
              {isAnimating ? (
                <div className="animate-pulse">
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-primary mb-3 sm:mb-4 animate-spin" />
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-muted-foreground">
                    Revealing Secret Code...
                  </p>
                </div>
              ) : (
                <div>
                  <Eye className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                  <Button 
                    onClick={handleReveal}
                    className="bg-gradient-to-r from-primary to-chart-3 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base min-h-[44px]"
                    data-testid="button-reveal-animation"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Reveal Secret Code
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 animate-fade-in">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-primary" />
              
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                  Secret Code
                </h2>
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border-2 border-primary/20">
                  <code className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-foreground tracking-wider break-all" data-testid="text-secret-code">
                    {secretCode}
                  </code>
                </div>
              </div>
              
              <Button 
                onClick={handleCopyCode}
                variant="outline"
                className="w-full min-h-[44px] text-sm sm:text-base"
                data-testid="button-copy-code"
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Copy Code
              </Button>
              
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tell this code to VideoWalker first to win!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sponsor Info - Responsive */}
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4 text-center">
          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1" data-testid="text-sponsor-info-name">
            {sponsorName}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2" data-testid="text-sponsor-info-tagline">
            {sponsorTagline}
          </p>
        </CardContent>
      </Card>

      {/* Mystery Description - Responsive */}
      {mysteryDescription && (
        <Card>
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <span className="text-lg sm:text-xl">🎁</span>
            </div>
            <h4 className="font-semibold text-sm sm:text-base text-chart-1 mb-2">Your Prize</h4>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
              {mysteryDescription}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}