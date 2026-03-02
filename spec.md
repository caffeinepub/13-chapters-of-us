# 13 Chapters of Us

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- 6-slide vertical scrolling anniversary web experience
- Slide 1: Milestone Entry — glowing "13" with heartbeat pulse, floating text stats, slow-falling heart/tulip petals with parallax touch reaction
- Slide 2: Evolution Slider — "Swipe to Evolve" before/after comparison slider (B&W left vs Glow right) with footer text
- Slide 3: Healing Breath — interactive glowing circle that expands/contracts on hold, text appears after 3 seconds of holding
- Slide 4: Loyalty Word Game — falling stars mini-game where user catches good words (Loyalty, Trust, Kisses, Our Future) and avoids bad words (Doubt, Silence, Distance) which shatter on touch; reward message on win
- Slide 5: 13th Chapter Letter — glassmorphism card with full letter content, elegant spaced typography, long scroll
- Slide 6: Seal the Deal — large 3D red "MWAHHHHH" button that triggers haptic vibration + emoji explosion of kisses, then shows Polaroid ending screen with upload button for latest pic
- Framer Motion liquid transitions between all slides
- Photo upload capability (Slide 6 Polaroid)

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Select blob-storage component for photo upload in Slide 6
2. Generate Motoko backend with photo/blob storage support
3. Build all 6 React slides with Framer Motion animations:
   - Full-screen vertical snap scroll layout
   - Slide 1: Canvas particle system for falling petals + touch parallax, glowing "13" with CSS keyframe pulse
   - Slide 2: Drag-based before/after image comparison slider with CSS filters
   - Slide 3: SVG breathing circle with scale animation, hold interaction triggering text reveal
   - Slide 4: Canvas or CSS-based falling words mini-game with collision detection
   - Slide 5: Glassmorphism card with full letter content
   - Slide 6: 3D button with box-shadow depth, emoji burst animation on tap, Polaroid frame with blob-storage upload
4. Apply Midnight Rose & Stardust palette throughout: #0A0A0A, #800000, Pearl White
