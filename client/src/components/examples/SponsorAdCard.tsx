import SponsorAdCard from '../SponsorAdCard';
import sponsorPoster from '@assets/generated_images/Tech_sponsor_ad_poster_de2247ee.png';

export default function SponsorAdCardExample() {
  return (
    <div className="max-w-sm mx-auto">
      <SponsorAdCard
        posterUrl={sponsorPoster}
        sponsorName="TechFlow Pro"
        sponsorTagline="Revolutionizing Digital Innovation"
        sponsorWebsite="https://example.com"
      />
    </div>
  );
}