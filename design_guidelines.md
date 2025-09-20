# VideoWalker Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern gaming and social platforms like Twitch, YouTube Gaming, and mobile gaming apps. The design emphasizes excitement, real-time engagement, and competitive elements while maintaining mobile-first accessibility.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Brand Primary: 280 85% 60% (vibrant purple for excitement and gaming feel)
- Background Dark: 240 10% 8% (deep dark for mobile viewing)
- Background Light: 0 0% 98% (clean light mode)

**Accent Colors:**
- Success/Winner: 142 76% 36% (celebratory green)
- Warning/Timer: 25 95% 53% (urgent orange for countdowns)
- Error: 0 84% 60% (clear red for errors)

**Gradient Treatments:**
- Hero backgrounds: Subtle purple to dark purple gradients
- Winner announcement overlays: Success green with opacity variations
- Timer urgency: Orange to red gradient as time expires

### Typography
- **Primary Font:** Inter (Google Fonts) - clean, mobile-optimized
- **Display Font:** Poppins (Google Fonts) - for headers and CTAs
- **Sizes:** Generous mobile sizing (16px+ base) with bold weights for gaming aesthetic

### Layout System
**Tailwind Spacing:** Primary units of 2, 4, 8, 16 for consistent rhythm
- Mobile-first 70/30 layout (sponsor ad dominant, gift section secondary)
- Card-based components with rounded corners (rounded-lg)
- Generous padding (p-4, p-8) for touch-friendly interfaces

### Component Library
**Core Elements:**
- Animated countdown timers with pulsing effects
- Reveal buttons with gaming-style hover states
- Winner announcement modals with celebration animations
- Card grids for winners history
- Real-time status indicators

**Navigation:**
- Bottom tab navigation for mobile
- Floating admin access button
- Breadcrumb navigation in admin panel

**Forms:**
- Large touch targets (min 44px)
- Clear visual feedback for form states
- File upload areas with drag-and-drop styling

**Data Displays:**
- Timeline layouts for winners history
- Progress indicators for ad campaigns
- Real-time status badges

### Visual Treatments
**Gaming Aesthetic:**
- Subtle glow effects on interactive elements
- Card hover states with elevation changes
- Success states with particle-like animations
- Timer urgency indicated through color transitions

**Mobile Optimization:**
- Touch-friendly button sizing
- Swipe gesture support indicators
- Thumb-zone optimized layouts
- High contrast for outdoor mobile viewing

### Images
**Hero Image:** Large hero image on homepage showcasing current sponsor ad (70% of viewport width on mobile)
**Placement Strategy:**
- Sponsor ad posters as primary visual elements
- Winner celebration imagery
- Gift/prize photography in secondary sections
- Admin uploaded campaign assets

**Image Treatment:**
- Rounded corners (rounded-lg) for modern feel
- Subtle shadows for depth
- Responsive sizing with proper aspect ratios
- Loading states with skeleton animations

### Animations
**Minimal but Impactful:**
- Countdown timer animations (pulsing, color changes)
- Secret code reveal transitions
- Winner announcement celebrations (confetti-style)
- Real-time update indicators
- Page transition smoothness for mobile navigation