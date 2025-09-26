import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, LogIn, Plus, Calendar, Trophy, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type InsertCampaign, type Campaign } from '@shared/schema';
import { z } from "zod";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

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
  active: z.boolean().default(true),
});

import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp, getDocs, deleteDoc } from "firebase/firestore";
import { firestore, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const formatDate = (date: Date | undefined | null) => {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return 'N/A';
};

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

interface EditCampaignFormProps {
  campaignId: string;
  onCampaignUpdated: () => void;
  onCancel: () => void;
}

function EditCampaignForm({ campaignId, onCampaignUpdated, onCancel }: EditCampaignFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: campaign, isLoading: campaignLoading } = useQuery<CampaignWithDate>({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const docRef = doc(firestore, 'campaigns', campaignId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Campaign;
        return { ...data, id: docSnap.id, 
          countdownEnd: data.countdownEnd ? data.countdownEnd.toDate() : new Date(), 
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date() 
        };
      } else {
        throw new Error("Campaign not found");
      }
    },
    enabled: !!campaignId,
  });

  const form = useForm<InsertCampaign>({
    resolver: zodResolver(campaignFormSchema),
    values: campaign ? {
      sponsorName: campaign.sponsorName,
      sponsorTagline: campaign.sponsorTagline,
      sponsorWebsite: campaign.sponsorWebsite,
      posterUrl: campaign.posterUrl,
      secretCode: campaign.secretCode,
      mysteryDescription: campaign.mysteryDescription,
      prizeValue: campaign.prizeValue || '',
      countdownEnd: campaign.countdownEnd,
      isActive: campaign.isActive,
    } : undefined,
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async (updatedData: Partial<InsertCampaign> & { winnerImageUrl?: string }) => {
      const campaignRef = doc(firestore, 'campaigns', campaignId);
      await updateDoc(campaignRef, {
        ...updatedData,
        countdownEnd: updatedData.countdownEnd ? Timestamp.fromDate(updatedData.countdownEnd) : undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Campaign Updated!",
        description: "The campaign has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      onCampaignUpdated();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update campaign: ${error.message}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
        setUploading(false);
    }
  });

  const handleImageUpload = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `winner_images/${campaignId}/${compressedFile.name}`);
      await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) { 
      console.error("Error compressing or uploading image: ", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const onSubmit = async (data: InsertCampaign) => {
    setUploading(true);
    let updatedData: Partial<InsertCampaign> & { winnerImageUrl?: string } = { ...data };

    if (selectedFile) {
      const imageUrl = await handleImageUpload(selectedFile);
      if (imageUrl) {
        updatedData.winnerImageUrl = imageUrl;
      } else {
        setUploading(false);
        return;
      }
    }

    updateCampaignMutation.mutate(updatedData);
  };

  if (campaignLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-muted-foreground">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8">
        <p className="text-destructive">Campaign not found or an error occurred.</p>
        <Button onClick={onCancel} className="mt-4">Back to Campaigns</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manage Campaigns
        </Button>
        <h2 className="text-2xl font-bold">Edit Campaign: {campaign.sponsorName}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Modify the details of your existing sponsor campaign.
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
                        <Input placeholder="e.g., TechFlow Pro" {...field} />
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
                        <Input placeholder="https://example.com" {...field} />
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
                      <Input placeholder="e.g., Revolutionizing Digital Innovation" {...field} />
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
                      <Input placeholder="URL to sponsor poster image" {...field} />
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
                        <Input placeholder="e.g., TECH2024WIN" {...field} />
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
                        <Input placeholder="e.g., $200+" {...field} value={field.value || ''} />
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
                        value={field.value instanceof Date ? formatDateTimeLocal(field.value) : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Winner Image</FormLabel>
                <FormControl>
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Campaign</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateCampaignMutation.isPending || uploading}
                  className="flex-1 bg-gradient-to-r from-primary to-chart-3"
                >
                  {uploading ? 'Uploading Image...' : updateCampaignMutation.isPending ? 'Updating...' : 'Update Campaign'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'create-campaign' | 'manage-campaigns' | 'edit-campaign' | 'view-campaign' | 'winners' | 'analytics'>('dashboard');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBackClick = () => {
    setLocation('/');
  };

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
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
      active: true,
    },
  });

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<CampaignWithDate[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(firestore, 'campaigns'));
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as Campaign;
        return {
          ...data,
          id: doc.id,
          countdownEnd: data.countdownEnd ? data.countdownEnd.toDate() : new Date(),
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        };
      });
    },
    enabled: !!user,
    select: (data) => data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  });

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.sponsorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      await deleteDoc(doc(firestore, "campaigns", campaignId));
    },
    onSuccess: () => {
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete campaign: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCampaign) => {
    createCampaignMutation.mutate(data);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
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
                Sign in to manage advertisements
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button 
                onClick={handleLogin}
                className="w-full"
                data-testid="button-login"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
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
      <main className="p-4 max-w-6xl mx-auto mb-20">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('manage-campaigns')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{campaigns.length}</div>
                  <p className="text-sm text-muted-foreground">Active campaigns</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('winners')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-chart-1" />
                    Winners
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-chart-1 mb-1">
                    {campaigns.filter(c => c.winnerImageUrl).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Campaigns with winners</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate cursor-pointer" onClick={() => setActiveView('analytics')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-chart-2" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-chart-2 mb-1">
                    {campaigns.filter(c => c.isActive).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Live campaigns</p>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-chart-3" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-chart-3 mb-1">
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
                    {filteredCampaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{campaign.sponsorName}</h4>
                          <p className="text-sm text-muted-foreground">{campaign.sponsorTagline}</p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            campaign.winnerImageUrl ? 'bg-green-100 text-green-800' :
                            campaign.active ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.winnerImageUrl ? 'Winner Selected' : campaign.active ? 'Active' : 'Inactive'}
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
                              value={field.value instanceof Date ? formatDateTimeLocal(field.value) : ''}
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              data-testid="input-countdown-end"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Campaign</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h2 className="text-xl sm:text-2xl font-bold">Manage Campaigns</h2>
              </div>
              <div className="w-full sm:w-auto">
                <Input 
                  placeholder="Search by sponsor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              {campaignsLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Loading campaigns...</p>
                  </CardContent>
                </Card>
              ) : filteredCampaigns.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">No campaigns found.</p>
                    <Button onClick={() => setActiveView('create-campaign')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="hover-elevate">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                            <h3 className="text-base sm:text-xl font-semibold">{campaign.sponsorName}</h3>
                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              campaign.winnerImageUrl ? 'bg-green-100 text-green-800' :
                              campaign.active ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.winnerImageUrl ? 'Winner Selected' : campaign.active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{campaign.sponsorTagline}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
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
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedCampaignId(campaign.id);
                            setActiveView('edit-campaign');
                          }}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => setLocation(`/campaign/${campaign.id}`)}>View</Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the campaign.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCampaignMutation.mutate(campaign.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeView === 'edit-campaign' && selectedCampaignId && (
          <EditCampaignForm 
            campaignId={selectedCampaignId} 
            onCampaignUpdated={() => {
              setActiveView('manage-campaigns');
              setSelectedCampaignId(null);
            }}
            onCancel={() => {
              setActiveView('manage-campaigns');
              setSelectedCampaignId(null);
            }}
          />
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