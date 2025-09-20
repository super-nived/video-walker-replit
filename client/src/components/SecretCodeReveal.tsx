import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecretCodeRevealProps {
  secretCode: string;
  sponsorName: string;
  sponsorTagline: string;
}

export default function SecretCodeReveal({ 
  secretCode, 
  sponsorName, 
  sponsorTagline 
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
    <div className="w-full max-w-md mx-auto p-4" data-testid="secret-code-reveal">
      {/* Secret Code Section */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-8 text-center bg-gradient-to-br from-primary/5 to-chart-3/5">
          {!isRevealed ? (
            <div className="space-y-4">
              {isAnimating ? (
                <div className="animate-pulse">
                  <Sparkles className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    Revealing Secret Code...
                  </p>
                </div>
              ) : (
                <div>
                  <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <Button 
                    onClick={handleReveal}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-chart-3"
                    data-testid="button-reveal-animation"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Reveal Secret Code
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <Sparkles className="w-12 h-12 mx-auto text-primary" />
              
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Secret Code
                </h2>
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border-2 border-primary/20">
                  <code className="text-3xl font-mono font-bold text-foreground tracking-wider" data-testid="text-secret-code">
                    {secretCode}
                  </code>
                </div>
              </div>
              
              <Button 
                onClick={handleCopyCode}
                variant="outline"
                className="w-full"
                data-testid="button-copy-code"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Tell this code to VideoWalker first to win!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sponsor Info */}
      <Card>
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold text-lg mb-1" data-testid="text-sponsor-info-name">
            {sponsorName}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-sponsor-info-tagline">
            {sponsorTagline}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}