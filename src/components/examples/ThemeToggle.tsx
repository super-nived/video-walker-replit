import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Click to toggle between light and dark mode
        </p>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}