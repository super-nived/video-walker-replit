import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <main className="p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-lg">Manage Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and edit sponsor advertisements
              </p>
              <Button className="w-full" data-testid="button-manage-ads">
                Manage Advertisements
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-lg">Set Winners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Declare winners and upload winner images
              </p>
              <Button className="w-full" data-testid="button-set-winners">
                Winner Management
              </Button>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View campaign performance and engagement
              </p>
              <Button className="w-full" data-testid="button-analytics">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Admin features will be implemented with full Firebase integration</p>
        </div>
      </main>
    </div>
  );
}