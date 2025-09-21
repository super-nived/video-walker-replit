import WinnerCard from '../WinnerCard';
import winnerImage from '@assets/generated_images/Happy_winner_celebration_85eef4f3.png';

export default function WinnerCardExample() {
  return (
    <div className="max-w-sm mx-auto">
      <WinnerCard
        winnerName="Sarah Johnson"
        winnerImageUrl={winnerImage}
        sponsorName="TechFlow Pro"
        giftTitle="Premium Wireless Headphones"
        giftDescription="High-quality noise-canceling headphones with 30-hour battery life"
        sponsorWebsite="https://example.com"
      />
    </div>
  );
}