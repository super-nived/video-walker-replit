import GiftSection from '../GiftSection';
import giftImage from '@assets/generated_images/Premium_headphones_gift_e7a81b00.png';

export default function GiftSectionExample() {
  const futureDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
  
  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Active countdown state */}
      <GiftSection
        giftTitle="Premium Wireless Headphones"
        giftDescription="High-quality noise-canceling headphones with 30-hour battery life"
        giftImageUrl={giftImage}
        countdownEnd={futureDate}
        hasWinner={false}
        onRevealCode={() => console.log('Reveal code clicked')}
        isCountdownExpired={false}
      />
      
      {/* Reveal button state */}
      <GiftSection
        giftTitle="Gaming Keyboard"
        giftDescription="Mechanical RGB gaming keyboard with custom switches"
        giftImageUrl={giftImage}
        countdownEnd={new Date(Date.now() - 1000)}
        hasWinner={false}
        onRevealCode={() => console.log('Reveal code clicked')}
        isCountdownExpired={true}
      />
    </div>
  );
}