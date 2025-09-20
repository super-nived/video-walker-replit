import CountdownTimer from '../CountdownTimer';

export default function CountdownTimerExample() {
  // Create a target date 2 hours from now for demo
  const targetDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  
  return (
    <div className="p-4 space-y-4">
      <CountdownTimer 
        targetDate={targetDate}
        onComplete={() => console.log('Countdown completed!')}
      />
      
      <div className="text-sm text-muted-foreground text-center">
        Demo countdown: 2 hours remaining
      </div>
    </div>
  );
}