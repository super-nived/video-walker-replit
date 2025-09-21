import Navigation from '../Navigation';

export default function NavigationExample() {
  return (
    <div className="relative h-32 bg-muted/20">
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">
          Bottom navigation appears on mobile
        </p>
      </div>
      <Navigation />
    </div>
  );
}