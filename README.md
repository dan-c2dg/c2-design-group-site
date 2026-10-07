# C2 Design Group — Full Website Package

Updated October 2026.

## Included
- `index.html` — complete one-page C2 Design Group website
- `sections/` — standalone versions of each major section
- `images/` — local image assets
- `models/` — C2Icon.glb and drone.glb

## Updates in this version
1. Full-screen sections now use the dynamic viewport height (`100dvh`) and no longer receive the ~100px anchor offset that caused the previous section to remain visible.
2. All section labels use the same `section-kicker` treatment. The previous `chapter-number` styling has been consolidated into it.
3. Our Story / “Keep good ideas rolling.”:
   - The C2 mark rolls clockwise and travels out of the viewport as the section progresses.
   - Motion reverses when scrolling upward.
4. Our Mission:
   - The ↗ arrow travels toward the upper-right on a 45° path as the section progresses.
   - Motion reverses when scrolling upward.
5. Our Work navigation:
   - The navigation pill morphs into a connected dropdown shape when open.
   - The submenu visually shares the nav bar background instead of appearing as a separate floating pill.
6. Anchor navigation now lands the target section at the actual top of the viewport. The fixed navigation overlays the section instead of shifting the section down.

## Run
Open `index.html` from a local web server. Because the site uses ES modules and GLB assets, a local server is recommended rather than `file://`.

Example:
`python3 -m http.server 8000`

Then visit:
`http://localhost:8000/`

## Notes
The site uses Three.js from jsDelivr and several C2DG/Wix-hosted media URLs. Replace remote media URLs with locally hosted assets if desired.

## Revision — October 7, 2026
- Work submenu lowered approximately 20px in its expanded state.
- Work submenu numbers 01–04 now sit before each title, matching the section-kicker hierarchy.
- Branding and Videography chapter content is vertically centered within the full viewport.
- Standalone Branding and Videography copy is explicitly visible without relying on the full-site reveal observer.


## v5 updates
- Laptop webpage scrolling now pauses until the laptop reaches its final position.
- Print page caption is positioned below the book in the same caption zone used by the digital experience.
- See `GITHUB-WIX-SETUP.md` for Wix and free GitHub Pages hosting instructions.
