import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, Trophy, Settings, HelpCircle, Goal } from 'lucide-react';

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/how-to-play', label: 'How to Play', icon: HelpCircle },
    { path: '/vision', label: 'Vision', icon: Goal },
    { path: '/winners', label: 'Winners', icon: Trophy }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t lg:hidden" data-testid="bottom-navigation">
      <div className="flex items-center justify-around p-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Button
            key={path}
            variant={location === path ? "default" : "ghost"}
            size="sm"
            onClick={() => setLocation(path)}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            data-testid={`nav-${label.toLowerCase()}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}