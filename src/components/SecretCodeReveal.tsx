import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Sparkles, Eye, Trophy, Link } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc } from "firebase/firestore";
import { firestore } from '@/lib/firebase';
import { type InsertWinner } from '@shared/schema';
import { z } from "zod";
import CountdownTimer from './CountdownTimer';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const winnerFormSchema = z.object({
  campaignId: z.string(),
  winnerName: z.string().min(1, "Winner name is required"),
  winnerEmail: z.string().email("Invalid email address").nullable().optional(),
  winnerPhone: z.string().nullable().optional(),
  codeUsed: z.string(),
});

import { useToast } from '@/hooks/use-toast';

interface SecretCodeRevealProps {
  campaignId: string;
  secretCode: string;
  sponsorName: string;
  sponsorTagline: string;
  posterUrl?: string;
  sponsorWebsite?: string;
  mysteryDescription?: string;
  isRevealed: boolean;
  isAnimating: boolean;
  onReveal: () => void;
  campaignEndDate: Date;
  winnerImageUrl?: string | null;
}

export default function SecretCodeReveal({
  campaignId,
  secretCode,
  sponsorName,
  sponsorTagline,
  posterUrl,
  sponsorWebsite,
  mysteryDescription,
  isRevealed,
  isAnimating,
  onReveal,
  campaignEndDate,
  winnerImageUrl
}: SecretCodeRevealProps) {
  const [isWinner, setIsWinner] = useState(false);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCampaignOver, setIsCampaignOver] = useState(new Date() > campaignEndDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsCampaignOver(new Date() > campaignEndDate);
    }, 1000);
    return () => clearInterval(timer);
  }, [campaignEndDate]);

  const form = useForm<InsertWinner>({
    resolver: zodResolver(winnerFormSchema),
    defaultValues: {
      campaignId,
      winnerName: '',
      winnerEmail: '',
      winnerPhone: '',
      codeUsed: secretCode,
    },
  });

  const submitWinnerMutation = useMutation({
    mutationFn: async (winner: InsertWinner) => {
      const docRef = await addDoc(collection(firestore, 'winners'), winner);
      return { id: docRef.id, ...winner };
    },
    onSuccess: () => {
      setIsWinner(true);
      setShowWinnerDialog(false);
      toast({
        title: "🎉 Congratulations!",
        description: "You're the winner! You'll be contacted soon about your prize.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns', 'active'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit winner information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitWinner = (data: InsertWinner) => {
    submitWinnerMutation.mutate(data);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(secretCode);
      toast({
        title: "Code Copied!",
        description: "Secret code copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="w-full mx-auto p-2 sm:p-3 md:p-4" data-testid="secret-code-reveal">
      <Card className="mb-4 sm:mb-6 overflow-hidden">
        <CardContent className="p-4 sm:p-6 md:p-8 text-center bg-gradient-to-br from-primary/5 to-chart-3/5">
          {winnerImageUrl ? (
            <div className="space-y-3 sm:space-y-4 animate-fade-in">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-chart-1" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-chart-1 mb-2 sm:mb-3">
                We Have a Winner!
              </h2>
              <img src={winnerImageUrl} alt="Campaign Winner" className="w-32 h-32 rounded-full mx-auto border-4 border-chart-1 shadow-lg" />
            </div>
          ) : !isCampaignOver ? (
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">
                Secret Code Reveals In
              </h2>
              <CountdownTimer targetDate={campaignEndDate} />
              <p className="text-xs sm:text-sm text-muted-foreground">
                The secret code will be revealed soon. Stay tuned!
              </p>
            </div>
          ) : !isRevealed ? (
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
                    onClick={onReveal}
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-3 sm:space-y-4">
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
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  If you missed any, be the first to tell Video Walker and earn a gift!
                </p>
                {!isWinner && (
                  <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-gradient-to-r from-chart-1 to-chart-2 min-h-[44px]"
                        data-testid="button-claim-prize"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        I Said the Code First - Claim Prize!
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Claim Your Prize!</DialogTitle>
                        <DialogDescription>
                          Fill in your details to claim your prize.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitWinner)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="winnerName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} data-testid="input-winner-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="winnerEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email (optional)</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your.email@example.com" {...field} value={field.value || ''} data-testid="input-winner-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="winnerPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (G-pay or any other)</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="+1234567890" {...field} value={field.value || ''} data-testid="input-winner-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              disabled={submitWinnerMutation.isPending}
                              className="bg-gradient-to-r from-chart-1 to-chart-2"
                              data-testid="button-submit-winner"
                            >
                              {submitWinnerMutation.isPending ? 'Submitting...' : 'Claim Prize'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4 overflow-hidden">
        <div className="flex items-center">
          <div className="w-1/2">
            <img src={posterUrl || './attached_assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png'} alt={sponsorName} className="w-full h-full object-cover" />
          </div>
          <div className="w-1/2 p-4">
            <h3 className="font-bold text-lg">{sponsorName}</h3>
            <p className="text-sm text-muted-foreground mb-2">{sponsorTagline}</p>
            {sponsorWebsite && (
              <a href={sponsorWebsite} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                <Link className="w-4 h-4" />
                Visit Sponsor
              </a>
            )}
          </div>
        </div>
      </Card>

      {isWinner && (
        <Card className="mb-4 border-green-200 bg-green-50">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg text-green-700 mb-2">🎉 Congratulations, Winner!</h3>
            <p className="text-sm text-green-600 mb-4">
              You've successfully claimed your prize! You'll be contacted soon with details about how to receive your reward.
            </p>
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-xs text-green-700 font-medium">
                Keep an eye on your email and phone for updates from the VideoWalker team!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
