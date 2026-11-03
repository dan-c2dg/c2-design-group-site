# C2DG — cinematic individual-page heroes

## Included
- `homepage-index.html`: original continuous homepage with 1280px content constraint (from prior package)
- 8 individual full-viewport animated hero HTML files. **Each has its own art direction**, not a recolored generic template.
- `WIX-VELO-OPTIONAL.js`: optional progress-message example for Wix integration.

## What each hero does
- Branding: overlapping brand blocks and circular identity construction
- Print + Digital: editorial pages flip away to reveal a browser/device
- Photography: shutter-style masks reveal architectural photography and focus guides
- Drone: aerial landscape zoom and stylized drone flyover with altitude display
- Videography: traveling film strip, play reticle, timecode
- Our Work: four creative-discipline tiles move into a composition
- Our Story: concentric brand rings and rotating momentum arrow
- Our Mission: targeting rings and a rising arrow

## Deploy on GitHub Pages
1. Upload the eight hero HTML files to `page-heroes/` in the existing `wix-animations` repo.
2. In Wix Studio create individual pages, e.g. Branding, Print + Digital, Photography, Drone, Videography, Our Work, Our Story, Our Mission.
3. At the top of each Wix page add an **Embed Site** pointing to `https://dan-c2dg.github.io/wix-animations/page-heroes/branding.html` (change filename for each page).
4. Stretch embed full width; set the height to about one viewport (for example 850px on desktop) and test tablet/mobile. Keep native Wix header, contact and footer OUTSIDE the iframe.
5. Use **Page** destinations for the standard Wix Studio custom menu. No query strings or section anchor hacks needed.
6. These heroes animate over 3.2 seconds on load in a fixed-height iframe, so Wix page scrolling stays native and never gets stuck inside an internally scrolling hero.

## Optional scroll control
The HTML also accepts messages `{channel:'c2dg-page-hero-v1', type:'SCROLL_PROGRESS', progress:0.5}` from the Wix origin. You can connect this to a tested Velo scroll progress implementation if you want the hero's progress to follow page scroll precisely. The supplied `WIX-VELO-OPTIONAL.js` is a message interface example, NOT a fully verified Wix scroll tracking integration. For production, use the auto-playing version first.

## Content and assets
The drone is a stylized CSS/HTML illustration, not your existing 3D GLB model. Photography and aerial backgrounds reference image URLs from the prior C2DG homepage. These are cinematic hero prototypes intended to sit above Wix-native page content, not complete inner service pages. The homepage's existing Three.js animation remains unchanged.
