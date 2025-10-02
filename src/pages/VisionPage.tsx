
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { VisionStats, Sponsor } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import ProgressBar from "@/components/ui/ProgressBar";

const VisionPage: FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery<VisionStats>({
    queryKey: ["vision-stats"],
    queryFn: async () => {
      const statsCollection = collection(firestore, "stats");
      const statsSnapshot = await getDocs(statsCollection);
      const statsData = statsSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {} as any);
      return {
        raisedAmount: statsData.raisedAmount?.value || 0,
        campaigns: statsData.campaigns?.value || 0,
        winners: statsData.winners?.value || 0,
      };
    },
  });

  const { data: sponsors, isLoading: isLoadingSponsors } = useQuery<Sponsor[]>({
    queryKey: ["top-sponsors"],
    queryFn: async () => {
      const campaignsCollection = collection(firestore, "campaigns");
      const q = query(
        campaignsCollection,
        orderBy("prizeValue", "desc"),
        limit(5)
      );
      const sponsorsSnapshot = await getDocs(q);
      return sponsorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().sponsorName,
        campaigns: 1, // This needs to be aggregated
        amount: doc.data().prizeValue,
      }));
    },
  });

  const goalAmount = 10000000;

  return (
    <div className="container mx-auto px-4 py-8 text-foreground">
      {/* Vision Statement */}
      <div className="bg-card p-6 rounded-2xl border border-border mb-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
          <span role="img" aria-label="target">
            🎯
          </span>{" "}
          Our Vision
        </h2>
        <p className="text-muted-foreground mb-4">
          VideoWalker connects advertisers directly with viewers through an
          exciting, competitive experience. We're not just showing ads—we're
          creating opportunities to win real prizes!
        </p>
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-6 rounded-xl text-center my-4">
          <div className="text-4xl font-bold">₹1,00,00,000</div>
          <div className="text-sm">Total Giveaway Goal</div>
        </div>
        <p className="text-muted-foreground">
          Every campaign brings us closer to this milestone. Join thousands of
          players competing for prizes while helping us make history!
        </p>
      </div>

      {/* Progress Bar */}
      {isLoadingStats ? (
        <Skeleton className="h-64 w-full mb-4" />
      ) : (
        <ProgressBar
          currentAmount={stats?.raisedAmount || 0}
          goalAmount={goalAmount}
        />
      )}

      {/* Stats */}
      <div className="bg-card p-6 rounded-2xl border border-border mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoadingStats ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <div className="bg-background p-4 rounded-xl text-center border">
                <div className="text-2xl font-bold text-primary">
                  ₹{stats?.raisedAmount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Raised So Far</div>
              </div>
              <div className="bg-background p-4 rounded-xl text-center border">
                <div className="text-2xl font-bold text-primary">
                  {(((stats?.raisedAmount || 0) / goalAmount) * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="bg-background p-4 rounded-xl text-center border">
                <div className="text-2xl font-bold text-primary">
                  {stats?.campaigns}
                </div>
                <div className="text-sm text-muted-foreground">Campaigns</div>
              </div>
              <div className="bg-background p-4 rounded-xl text-center border">
                <div className="text-2xl font-bold text-primary">
                  {stats?.winners}
                </div>
                <div className="text-sm text-muted-foreground">Winners</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Sponsors */}
      <div className="bg-card p-6 rounded-2xl border border-border mb-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          Top 5 Sponsors
        </h2>
        <div className="space-y-4">
          {isLoadingSponsors ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : (
            sponsors?.map((sponsor, index) => (
              <div
                key={sponsor.id}
                className="flex items-center justify-between p-4 bg-background rounded-xl border"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${[
                      "bg-yellow-500",
                      "bg-gray-400",
                      "bg-yellow-600",
                    ][index] || "bg-primary"}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold">{sponsor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sponsor.campaigns} campaigns
                    </div>
                  </div>
                </div>
                <div className="font-bold text-primary">
                  ₹{sponsor.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-card p-6 rounded-2xl border border-border mb-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
          <span role="img" aria-label="light-bulb">
            💡
          </span>{" "}
          How It Works
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold">Advertisers Compete Daily</h3>
              <p className="text-muted-foreground text-sm">
                Each day, advertisers must bid at least ₹1 more than yesterday's
                campaign to feature their ad.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold">Watch Complete Ads</h3>
              <p className="text-muted-foreground text-sm">
                Watch the full advertisement to participate. No skipping
                allowed!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold">Wait for Secret Code</h3>
              <p className="text-muted-foreground text-sm">
                After the ad, a countdown begins. Be ready when the secret code
                reveals!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold">First Submission Wins</h3>
              <p className="text-muted-foreground text-sm">
                The first person to submit the correct code wins the prize.
                Speed matters!
              </p>
            </div>
          </div>
        </div>
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-lg mt-6">
          <p className="font-bold text-primary">
            Important:
            <span className="font-normal text-muted-foreground">
              {" "}
              Each campaign has only ONE winner. The fastest participant who
              submits the correct code after it's revealed claims the prize!
            </span>
          </p>
        </div>
      </div>

      {/* Always Growing */}
      <div className="bg-card p-6 rounded-2xl border border-border">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-primary">
          <span role="img" aria-label="chart-increasing">
            📈
          </span>{" "}
          Always Growing
        </h2>
        <p className="text-muted-foreground mb-4">
          Our unique bidding system ensures steady growth. Every campaign is
          worth more than the previous one, creating an exciting progression
          toward our $1M goal!
        </p>
        <p className="text-muted-foreground">
          <strong className="text-primary">Example:</strong> If today's campaign
          is ₹100, tomorrow's minimum bid must be ₹101. This guarantees
          continuous progress!
        </p>
      </div>
    </div>
  );
};

export default VisionPage;
