import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Campaign } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface CampaignWithDate extends Campaign {
  countdownEnd: Date;
  createdAt: Date;
}

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id;
  const [, setLocation] = useLocation();

  const { data: campaign, isLoading, error } = useQuery<CampaignWithDate>({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("Campaign ID is missing");
      const docRef = doc(firestore, "campaigns", campaignId);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading campaign details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => setLocation("/admin")}>Back to Admin</Button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <h1 className="text-2xl font-bold text-primary mb-4">Campaign Not Found</h1>
        <p className="text-muted-foreground mb-6">The campaign you are looking for does not exist.</p>
        <Button onClick={() => setLocation("/admin")}>Back to Admin</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Button>

        <div className="text-center">
          <h1 className="text-xl font-bold text-primary">Campaign Details</h1>
        </div>

        <ThemeToggle />
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{campaign.sponsorName}</span>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                campaign.hasWinner ? 'bg-green-100 text-green-800' :
                campaign.isActive ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {campaign.hasWinner ? 'Winner Selected' : campaign.isActive ? 'Active' : 'Inactive'}
              </div>
            </CardTitle>
            <p className="text-muted-foreground">{campaign.sponsorTagline}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Website:</h3>
                <a href={campaign.sponsorWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  {campaign.sponsorWebsite} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div>
                <h3 className="font-semibold">Poster URL:</h3>
                <a href={campaign.posterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                  View Poster <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Secret Code:</h3>
              <p className="font-mono text-lg text-primary">{campaign.secretCode}</p>
            </div>

            <div>
              <h3 className="font-semibold">Prize Value:</h3>
              <p>{campaign.prizeValue || "Not specified"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Mystery Prize Description:</h3>
              <p>{campaign.mysteryDescription}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Ends On:</h3>
                <p>{new Date(campaign.countdownEnd).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Created On:</h3>
                <p>{new Date(campaign.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setLocation(`/admin?edit=${campaign.id}`)}>Edit Campaign</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
