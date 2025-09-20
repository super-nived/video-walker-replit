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
import Navigation from "@/components/Navigation";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/secret-code" component={SecretCodePage} />
        <Route path="/winners" component={WinnersPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </>
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
