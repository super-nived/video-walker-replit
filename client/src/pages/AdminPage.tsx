import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, LogIn, Plus, Calendar, Trophy, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type InsertCampaign, type Campaign } from '@shared/schema';
import { z } from "zod";

interface CampaignWithDate extends Campaign {
  countdownEnd: Date;
  createdAt: Date;
}

const campaignFormSchema = z.object({
  sponsorName: z.string().min(1, "Sponsor name is required"),
  sponsorTagline: z.string().min(1, "Sponsor tagline is required"),
  sponsorWebsite: z.string().url("Invalid URL").min(1, "Sponsor website is required"),
  posterUrl: z.string().url("Invalid URL").min(1, "Poster URL is required"),
  secretCode: z.string().min(1, "Secret code is required"),
  mysteryDescription: z.string().min(1, "Mystery description is required"),
  prizeValue: z.string().optional(),
  countdownEnd: z.date(),
  isActive: z.boolean().optional(),
  hasWinner: z.boolean().optional(),
});

import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc } from "firebase/firestore";
import { firestore } from '@/lib/firebase';
import ThemeToggle from '@/components/ThemeToggle';

const formatDate = (date: Date | undefined | null) => {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return 'N/A';
};

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'create-campaign' | 'manage-campaigns' | 'winners' | 'analytics'>('dashboard');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleBackClick = () => {
    console.log('Navigating back to home');
    setLocation('/');
  };

  const handleLogin = () => {
    console.log('Google login clicked - would use Firebase auth');
    // todo: remove mock functionality - implement Firebase Google auth
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  // Campaign form setup
  const form = useForm<InsertCampaign>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      sponsorName: '',
      sponsorTagline: '',
      sponsorWebsite: '',
      posterUrl: '',
      secretCode: '',
      mysteryDescription: '',
      prizeValue: '',
      countdownEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true,
      hasWinner: false,
    },
  });

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<CampaignWithDate[]>({
    queryKey: ['campaigns'],
    enabled: isLoggedIn,
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: InsertCampaign) => {
      const docRef = await addDoc(collection(firestore, 'campaigns'), campaign);
      return { id: docRef.id, ...campaign }; // Return the created campaign with its ID
    },
    onSuccess: () => {
      toast({
        title: "Campaign Created!",
        description: "Your new campaign has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setActiveView('manage-campaigns');
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCampaign) => {
    createCampaignMutation.mutate(data);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="flex items-center gap-2"
            data-testid="button-back-home-admin"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary">
              Admin Panel
            </h1>
          </div>
          
          <ThemeToggle />
        </header>

        {/* Login Form */}
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Admin Access Required</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sign in with Google to manage advertisements
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleLogin}
                className="w-full"
                data-testid="button-google-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign in with Google
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Access restricted to authorized administrators only
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Admin Dashboard Content */}
      <main className="p-4 max-w-6xl mx-auto">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-muted-foreground">Manage your VideoWalker campaigns</p>
              </div>
              <Button 
                onClick={() => setActiveView('create-campaign')}
                className="bg-gradient-to-r from-primary to-chart-3"
                data-testid="button-create-campaign"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('manage-campaigns')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-1">{campaigns.length}</div>
                  <p className="text-sm text-muted-foreground">Active campaigns</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('winners')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-chart-1" />
                    Winners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1 mb-1">
                    {campaigns.filter(c => c.hasWinner).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Campaigns with winners</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('analytics')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-chart-2" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2 mb-1">
                    {campaigns.filter(c => c.isActive).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Live campaigns</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-chart-3" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3 mb-1">
                    {campaigns.filter(c => new Date(c.countdownEnd) > new Date()).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active countdowns</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                {campaignsLoading ? (
                  <p className="text-muted-foreground">Loading campaigns...</p>
                ) : campaigns.length === 0 ? (
                  <p className="text-muted-foreground">No campaigns yet. Create your first campaign to get started!</p>
                ) : (
                  <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.sponsorName}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.sponsorTagline}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            campaign.hasWinner ? 'bg-green-100 text-green-800' : 
                            campaign.isActive ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.hasWinner ? 'Winner Selected' : campaign.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'create-campaign' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold">Create New Campaign</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create an interactive sponsor campaign for VideoWalker
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sponsorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sponsor Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., TechFlow Pro" {...field} data-testid="input-sponsor-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sponsorWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} data-testid="input-sponsor-website" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="sponsorTagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sponsor Tagline</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Revolutionizing Digital Innovation" {...field} data-testid="input-sponsor-tagline" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="posterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Poster Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="URL to sponsor poster image" {...field} data-testid="input-poster-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="secretCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secret Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., TECH2024WIN" {...field} data-testid="input-secret-code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prizeValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prize Value</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., $200+" {...field} value={field.value || ''} data-testid="input-prize-value" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="mysteryDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mystery Prize Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the mystery prize that winners will receive..." 
                              className="min-h-[100px]"
                              {...field} 
                              data-testid="textarea-mystery-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="countdownEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign End Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local"
                              {...field}
                              value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              data-testid="input-countdown-end"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveView('dashboard')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createCampaignMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-primary to-chart-3"
                        data-testid="button-submit-campaign"
                      >
                        {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'manage-campaigns' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold">Manage Campaigns</h2>
            </div>

            <div className="space-y-4">
              {campaignsLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Loading campaigns...</p>
                  </CardContent>
                </Card>
              ) : campaigns.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No campaigns created yet.</p>
                    <Button onClick={() => setActiveView('create-campaign')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                campaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{campaign.sponsorName}</h3>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              campaign.hasWinner ? 'bg-green-100 text-green-800' : 
                              campaign.isActive ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.hasWinner ? 'Winner Selected' : campaign.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{campaign.sponsorTagline}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Secret Code:</span>
                              <p className="font-mono text-primary">{campaign.secretCode}</p>
                            </div>
                            <div>
                              <span className="font-medium">Prize Value:</span>
                              <p>{campaign.prizeValue || 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Ends:</span>
                              <p>{formatDate(campaign.countdownEnd)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Created:</span>
                              <p>{new Date(campaign.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {(activeView === 'winners' || activeView === 'analytics') && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h2 className="text-2xl font-bold">
                {activeView === 'winners' ? 'Winner Management' : 'Analytics'}
              </h2>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  {activeView === 'winners' ? 
                    <Trophy className="w-8 h-8 text-muted-foreground" /> :
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  }
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  {activeView === 'winners' ? 
                    'Winner management features will be available soon.' :
                    'Campaign analytics and insights will be available soon.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}