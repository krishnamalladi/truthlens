# TruthLens Chrome extension

TruthLens provides *context* about a news article or social-media post's source and transparency signals. It uses “Looks credible” or “Needs verification” because publisher reputation alone cannot establish whether a specific claim is true.

## Install locally

1. Open `chrome://extensions` in Chrome or another Chromium-based browser.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `truth-lens-extension` folder.
4. Visit a news article and click the TruthLens toolbar icon.

## How it works

- **Page reading is off by default.** While off, TruthLens does not inspect the text, links, title, captions, or other content on any webpage. Turning it on analyzes only the tab open when you click the TruthLens icon.
- The local **TruthLens Source Registry** (`source-registry.js`) supplies source-context scores. It is owned by this extension; it does not rely on RumorGuard or another fact-checking service.
- Registry entries are added only when a publisher has documented editorial standards, a corrections process, a professional reporting structure, and a pattern of source attribution. A score is never proof that an individual claim is true.
- Platforms, portals, and community-edited references are classified separately. They can be useful starting points, but they do not receive a “Looks credible” result based solely on the host domain.
- The extension scans only the active page, including common social-media pages, for non-sensitive signals such as external links, attribution language, and update/correction notices.
- For social posts, choose **Why?** to see the visible post text TruthLens extracted and open any external links attached to that post.
- On YouTube, TruthLens reads the video title, visible description, and any subtitle/caption track the player exposes. Open the individual video or Short page, wait for it to finish loading, then click the extension. It identifies likely entertainment/tutorial content as “Not news content”; it does not certify a news claim as true or false without independently verifiable evidence.
- It makes no network requests and sends no browsing data anywhere.

To expand source coverage, add domains to `TRUTHLENS_REGISTRY` in `source-registry.js`. Each entry should be backed by the publisher's documented editorial practices and corrections policy. Never add a score solely because the publisher agrees with a point of view.
