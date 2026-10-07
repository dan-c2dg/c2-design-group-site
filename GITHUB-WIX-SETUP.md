# C2DG Website — Wix + GitHub Pages Setup (v5)

## Wix
1. Publish the site first, then add visible content with **Embed Code / HTML iframe** in Wix.
2. For an external hosted section, use the GitHub Pages HTTPS URL as the iframe source.
3. Give each embed enough height for its scroll experience. The flipbook section is intentionally much taller than one viewport.
4. Do not add an extra Wix spacer above the embeds. The supplied sections already account for the fixed navigation.
5. Test on the published Wix site, not only the Editor preview.

## GitHub Pages — free public repository
1. Create a new **public** GitHub repository.
2. Upload the contents of this folder so `index.html` is at the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch containing the site (normally `main`) and the `/ (root)` folder, then save.
6. Wait for the Pages deployment to finish. GitHub will provide an HTTPS Pages URL.
7. Test the URL directly. Confirm models, images, CSS, JavaScript, and section links all load.
8. In Wix, use that HTTPS URL as an **Embed Site** source, or embed the individual section URL if using the modular package.

## Updating the site
Replace the changed files in the repository and commit them to `main`. GitHub Pages will redeploy the site automatically.

## Important paths
Keep the `images/` and `models/` folders beside `index.html`. Do not rename `C2Icon.glb` or `drone.glb` unless you also update the HTML paths.

## Laptop webpage image
The laptop uses one persistent image and scrolls it vertically inside a masked screen. Replace `images/AAA-website.png` with a tall webpage screenshot. Keep the filename or update the `digitalScrollImage` variable in the flipbook HTML.

## Custom domain
If you later want `www.c2dg.com` or another domain to point to GitHub Pages, configure the domain in GitHub Pages and update DNS at the domain provider. Keep HTTPS enabled.
