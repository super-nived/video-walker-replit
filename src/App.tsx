import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import SecretCodePage from "@/pages/SecretCodePage";
import WinnersPage from "@/pages/WinnersPage";
import AdminPage from "@/pages/AdminPage";
import HowToPlayPage from "@/pages/HowToPlayPage";
import CampaignDetailsPage from "@/pages/CampaignDetailsPage";
import VisionPage from "@/pages/VisionPage";
import Navigation from "@/components/Navigation";

function Router() {
  return (
    <div className="pb-20 lg:pb-0">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/secret-code" component={SecretCodePage} />
        <Route path="/vision" component={VisionPage} />
        <Route path="/winners" component={WinnersPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/how-to-play" component={HowToPlayPage} />
        <Route path="/campaign/:id" component={CampaignDetailsPage} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
