# TruthLens Chrome extension

TruthLens provides *context* about a news article or social-media post's source and transparency signals. Its simple result is “Credible” or “Not credible”; the **Why?** panel shows the evidence behind that estimate.

## Install locally

1. Open `chrome://extensions` in Chrome or another Chromium-based browser.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this `truth-lens-extension` folder.
4. Visit a news article and click the TruthLens toolbar icon.

## How it works

- **Page reading is off by default.** While off, TruthLens does not inspect the text, links, title, captions, or other content on any webpage. Turning it on analyzes only the tab open when you click the TruthLens icon.
- The local **TruthLens Source Registry** (`source-registry.js`) supplies source-context scores. It is owned by this extension; it does not rely on RumorGuard or another fact-checking service.
- Registry entries are added only when a publisher has documented editorial standards, a corrections process, a professional reporting structure, and a pattern of source attribution. A score is never proof that an individual claim is true.
- For an unlisted website, TruthLens creates a **provisional local estimate** from visible signals: byline, publication date, policy/contact links, external citations, and article length. This is not a fact-check and never turns an unknown publisher into a fully verified source.
- The compact claims strip extracts a likely main claim, shows whether the page includes source links, and displays a safety warning only for health, money, election, or urgent-action language. It does not send page content to any third party.
- The AI disclosure check looks for explicit AI-generated, synthetic-media, or altered-media labels in metadata, image descriptions, captions, and video labels. A missing disclosure is not proof that content is human-made.
- The scam check warns about visible scam-risk signals such as urgent pressure, fake security alerts, prize messages, advance-fee requests, too-good-to-be-true offers, sketchy download prompts, high-risk payment language, requests for passwords or codes, unusual domain patterns, insecure connections, missing contact/policy pages, and external form submissions. It cannot prove a website is safe or fraudulent.
- When more than one concern is found, the compact **Flags** line lists each one together: possible scam signs, an AI/altered-media disclosure, and misinformation risk.
- Platforms, portals, and community-edited references are classified separately. They can be useful starting points, but they do not receive a “Looks credible” result based solely on the host domain.
- The extension scans only the active page, including common social-media pages, for non-sensitive signals such as external links, attribution language, and update/correction notices.
- For social posts, choose **Why?** to see the visible post text TruthLens extracted and open any external links attached to that post.
- On YouTube, TruthLens reads the video title, visible description, and any subtitle/caption track the player exposes. Open the individual video or Short page, wait for it to finish loading, then click the extension. It identifies likely entertainment/tutorial content as “Not news content”; it does not certify a news claim as true or false without independently verifiable evidence.
- It makes no network requests and sends no browsing data anywhere.

To expand source coverage, add domains to `TRUTHLENS_REGISTRY` in `source-registry.js`. Each entry should be backed by the publisher's documented editorial practices and corrections policy. Never add a score solely because the publisher agrees with a point of view.
