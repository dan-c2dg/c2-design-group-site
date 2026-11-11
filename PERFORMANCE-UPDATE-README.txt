C2DG PERFORMANCE SYNC — November 11, 2026

IMPORTANT FINDING
Wix points to /wix-animations/index.html, but that file was an older version
than the root /index.html. It continuously rendered BOTH WebGL scenes and
loaded the drone immediately, even when it was far offscreen.

CHANGES
- Synchronized wix-animations/index.html with the newer optimized root index.html.
- Preserved the Wix NAVIGATE, READY, CONTACT and SCROLL_TO messaging logic.
- Drone WebGL renderer/model now initialize only near the drone section.
- Hero and drone animation loops run only while near viewport; mobile frame cap.
- Video loads on proximity (desktop) or deliberate play (mobile).
- Includes missing mobile-optimized WebP assets in wix-animations/images/.
- Root homepage and all other project files are preserved.

DEPLOY
1. Back up your GitHub repository.
2. Upload/replace the files in this ZIP in the same repository structure.
3. Do NOT change the Wix iframe URL. It should still load:
   https://dan-c2dg.github.io/c2-design-group-site/wix-animations/index.html
4. Do NOT replace existing Wix Velo code for this test.
5. Hard refresh and confirm 3D hero, flipbook, drone, CTAs and Wix scrolling.
6. Re-run PageSpeed mobile and desktop, preferably 3 times each.

NOTE: The embedded page was updated to the optimized root version. Its exact
visual parity and all interactions need browser validation after deployment.
No performance score is guaranteed.
