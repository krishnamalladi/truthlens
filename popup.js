function sourceForHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  const key = Object.keys(TRUTHLENS_REGISTRY).sort((a, b) => b.length - a.length)
    .find(domain => host === domain || host.endsWith(`.${domain}`));
  return key ? TRUTHLENS_REGISTRY[key] : null;
}
function isEstablishedNewsroom(source) {
  // Older registry entries identify established newsrooms by their curated score,
  // while newer entries may include an explicit kind field.
  return Boolean(source && (source.kind === 'newsroom' || source.score >= 70));
}
function makeSignals(data) {
  const text = data.text.toLowerCase(); const signals = [];
  if (data.social) signals.push('This is a social-media page. Posts can spread before independent verification.');
  if (data.isYouTube && data.captions) signals.push('Available subtitles were read locally as additional context.');
  if (data.isYouTube && !data.captions) signals.push('No readable subtitles are available yet. The title and description were checked instead.');
  if (data.externalLinks >= 3) signals.push('Includes links to outside sources or evidence.'); else signals.push('Few visible links to outside sources. Look for original evidence.');
  if (/\b(according to|data from|report|study|documents?)\b/.test(text)) signals.push('References reporting, documents, data, or attributed sources.');
  else signals.push('Limited source-attribution language was detected.');
  if (/\b(opinion|editorial|commentary|analysis)\b/.test(text)) signals.push('May include analysis or opinion. Separate it from reported facts.');
  if (/\b(correction|updated|update:)\b/.test(text)) signals.push('An update or correction notice appears on the page.');
  return signals;
}
function looksLikeNonNews(data) {
  const text = `${data.title} ${data.text} ${data.captions || ''}`.toLowerCase();
  return /\b(music video|official music|lyrics?|song|cover song|gaming|gameplay|walkthrough|let'?s play|asmr|mukbang|recipe|cooking|makeup|beauty|unboxing|prank|comedy|funny|dance|workout|meditation|bedtime story|tutorial)\b/.test(text);
}
function estimateUnknownSource(data) {
  let score = 25;
  const clues = [];
  if (data.author) { score += 15; clues.push('A named author or byline is visible.'); }
  else clues.push('No clear author or byline was found.');
  if (data.date) { score += 10; clues.push('A publication date is visible.'); }
  else clues.push('No clear publication date was found.');
  if (data.transparencyLinks >= 2) { score += 20; clues.push('The site links to multiple transparency or policy pages.'); }
  else if (data.transparencyLinks) { score += 10; clues.push('The site links to at least one transparency or policy page.'); }
  else clues.push('No visible corrections, standards, contact, or ownership links were found.');
  if (data.externalLinks >= 3) { score += 15; clues.push('The article links to several outside sources.'); }
  else if (data.externalLinks) { score += 7; clues.push('The article links to an outside source.'); }
  else clues.push('The article has no visible external source links.');
  if (data.text.length >= 800) { score += 8; clues.push('The page contains substantial readable article text.'); }
  return { score: Math.min(score, 85), clues };
}
function extractMainClaim(data) {
  try {
    if (new URL(data.url).pathname === '/') return 'Open a specific article to check its main claim.';
  } catch { /* Keep the normal headline check when a page URL is unavailable. */ }
  const title = (data.title || '').replace(/\s+/g, ' ').replace(/\s*[|–—]\s*[^|–—]+$/, '').trim();
  const looksLikePageChrome = /\b(gift unlocked|listen \(|article\b|subscribe|sign in|minutes? read|\b\d{1,2}:\d{2}\s*(am|pm)\b)\b/i.test(title);
  const description = (data.description || '').replace(/\s+/g, ' ').trim();
  if (data.isOpinion && description.length >= 20 && description.length <= 220) return `Opinion: ${description}`;
  if (title.length >= 12 && title.length <= 180 && !looksLikePageChrome) return title;
  if (description.length >= 20 && description.length <= 220) return data.isOpinion ? `Opinion: ${description}` : description;
  return 'No clear headline found on this page.';
}
function isHomePage(data) {
  try { return new URL(data.url).pathname === '/'; } catch { return false; }
}
function safetyCheck(data) {
  const text = `${data.title} ${data.text} ${data.captions || ''}`.toLowerCase();
  const categories = [];
  if (/\b(cure|treatment|vaccine|cancer|doctor|medical|health|symptom|disease)\b/.test(text)) categories.push('health');
  if (/\b(investment|crypto|bitcoin|bank|loan|wire transfer|giveaway|prize|refund|money)\b/.test(text)) categories.push('money');
  if (/\b(election|vote|ballot|polling place|fraud)\b/.test(text)) categories.push('elections');
  if (/\b(urgent|immediately|share this|breaking|emergency|disaster|evacuate)\b/.test(text)) categories.push('urgent claim');
  return [...new Set(categories)];
}
function scamCheck(data, source) {
  // A known newsroom can legitimately include account, subscription, and payment forms.
  // This page-level heuristic is not designed to inspect advertising or account flows.
  if (isEstablishedNewsroom(source)) return [];
  const text = `${data.title} ${data.text}`.toLowerCase();
  const flags = [];
  const urgent = /\b(act now|urgent|immediately|limited time|final warning|account.*(?:suspend|lock)|verify.*account)\b/.test(text);
  const payment = /\b(gift card|wire transfer|crypto(?:currency)?|bitcoin|send money|guaranteed profit|double your money)\b/.test(text);
  const sensitive = /\b(one[- ]time code|verification code|security code|password|social security number)\b/.test(text);
  const lottery = /\b(you(?:'ve| have)? won|claim (?:your )?(?:prize|reward|lottery|jackpot)|lottery winner|unclaimed (?:prize|reward)|congratulations)\b/.test(text);
  const fakeSecurityAlert = /\b(virus detected|device (?:is )?infected|computer (?:is )?locked|security alert|call (?:now|immediately).{0,30}(?:support|technician)|microsoft support|apple support)\b/.test(text);
  const tooGoodToBeTrue = /\b(free (?:iphone|phone|gift card|laptop)|instant cash|risk[- ]free|guaranteed (?:income|loan|approval|returns?)|earn \$?\d+.{0,25}(?:day|week|month))\b/.test(text);
  const advanceFee = /\b(processing fee|release fee|activation fee|clearance fee|pay (?:a |the )?(?:small )?fee|fee (?:to|for) (?:claim|release|receive))\b/.test(text);
  const downloadPressure = /\b(download (?:this|the) (?:file|app|extension)|install (?:this|the) (?:app|extension)|enable (?:macros|notifications))\b/.test(text);
  if (urgent) flags.push('urgent-pressure language');
  if (payment) flags.push('high-risk payment language');
  if (sensitive) flags.push('sensitive-information request');
  if (lottery) flags.push('lottery or prize message');
  if (fakeSecurityAlert) flags.push('fake security-alert language');
  if (tooGoodToBeTrue) flags.push('too-good-to-be-true offer');
  if (advanceFee) flags.push('advance-fee request');
  if (downloadPressure) flags.push('pressure to download or install something');
  if (data.hasPasswordField && (urgent || sensitive)) flags.push('password form paired with a sensitive request');
  if (data.hasPaymentField && payment) flags.push('payment form paired with high-risk payment language');
  if (data.externalForm && (urgent || payment || sensitive)) flags.push('form submits to another site');
  if (data.protocol !== 'https:') flags.push('not using a secure connection');
  if (/xn--|(?:-|\.){3,}/i.test(data.hostname) || /\.(zip|top|click|country|gq)$/i.test(data.hostname)) flags.push('unusual domain pattern');
  if (!data.transparencyLinks && (urgent || payment || sensitive || lottery || fakeSecurityAlert || tooGoodToBeTrue || advanceFee || downloadPressure)) flags.push('no clear contact or policy page');
  return [...new Set(flags)];
}
async function readActiveTab(tab) {
  try {
    return await chrome.tabs.sendMessage(tab.id, { type: 'GET_ARTICLE_DATA' });
  } catch {
    // The page may have been open before TruthLens was installed or reloaded.
    // Inject only after the user opens the popup and has enabled page reading.
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    return chrome.tabs.sendMessage(tab.id, { type: 'GET_ARTICLE_DATA' });
  }
}
function render(data) {
  const source = sourceForHostname(data.hostname);
  const estimate = source ? null : estimateUnknownSource(data);
  const score = source?.score ?? (data.social ? 30 : estimate.score);
  const notNews = data.isYouTube && looksLikeNonNews(data);
  const credible = !data.social && (source ? isEstablishedNewsroom(source) : score >= 65);
  const claim = extractMainClaim(data);
  const homePage = isHomePage(data);
  const risks = safetyCheck(data);
  const scamFlags = scamCheck(data, source);
  document.querySelector('#publisher').textContent = source?.name ?? (data.social ? 'Social-media post' : 'Unlisted publisher');
  document.querySelector('#domain').textContent = data.hostname;
  document.querySelector('#score').textContent = source ? `${score}/100` : data.social ? 'Check' : `~${score}/100`;
  const verdict = document.querySelector('#verdict');
  const isNotCredible = scamFlags.length >= 2 || !credible;
  verdict.textContent = notNews ? 'Not news' : isNotCredible ? 'Not credible' : 'Credible';
  verdict.classList.toggle('cautious', isNotCredible);
  document.querySelector('#rating').textContent = notNews ? 'This video appears to be entertainment, a tutorial, or another non-news format. That is not a judgment about its quality or accuracy.' : credible && source ? `${source.tier}. ${source.note}` : (data.social ? 'Social posts are not independently fact-checked by TruthLens. Look for the original source before sharing.' : source ? `${source.tier}. ${source.note}` : `Provisional ${score}/100 estimate based on visible transparency signals. It is not a fact-check or an endorsement of the publisher.`);
  document.querySelector('#headline').textContent = data.title || 'This page';
  const claimsStrip = document.querySelector('#claims-strip');
  claimsStrip.hidden = false;
  document.querySelector('#main-claim').textContent = claim;
  const claimStatus = document.querySelector('#claim-status');
  claimStatus.hidden = homePage;
  claimStatus.textContent = credible && source
    ? '✓ This is a known news website. We did not find basic scam signs.'
    : data.externalLinks >= 2
      ? 'This page links to other sources. Open Why to review them.'
      : 'This page does not clearly link to other sources.';
  const aiStatus = document.querySelector('#ai-status');
  aiStatus.hidden = homePage || !data.aiDisclosure?.length;
  aiStatus.textContent = data.aiDisclosure?.length
    ? 'This page says some content was made or changed with AI.'
    : '';
  const scamStatus = document.querySelector('#scam-status');
  scamStatus.hidden = !scamFlags.length;
  scamStatus.textContent = `Scam check: possible ${scamFlags.join(', ')}. Do not enter passwords, codes, or payment details until you verify the site.`;
  const riskLabels = [];
  if (scamFlags.length) riskLabels.push('possible scam signs');
  if (data.aiDisclosure?.length) riskLabels.push('AI or altered-media disclosure');
  if (!credible && !notNews) riskLabels.push('misinformation risk');
  const riskSummary = document.querySelector('#risk-summary');
  riskSummary.hidden = !riskLabels.length;
  riskSummary.textContent = `Flags: ${riskLabels.join(' · ')}`;
  const safetyMessage = document.querySelector('#safety-message');
  safetyMessage.hidden = homePage || !risks.length;
  safetyMessage.textContent = risks.length ? `Safety: This page mentions ${risks.join(', ')}. Check carefully before you act or share.` : '';
  const preview = document.querySelector('#post-preview');
  preview.hidden = !data.social;
  if (data.social) {
    document.querySelector('#post-text').textContent = data.text || 'No visible post text was found. Try opening the individual post, signing in if necessary, then reopen TruthLens.';
    const captionsPreview = document.querySelector('#captions-preview');
    captionsPreview.hidden = !data.captions;
    if (data.captions) document.querySelector('#caption-text').textContent = data.captions;
    const links = document.querySelector('#post-links');
    links.replaceChildren(...data.outboundUrls.map(url => {
      const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noreferrer';
      a.textContent = `Open linked source: ${new URL(url).hostname}`; return a;
    }));
    if (!data.outboundUrls.length) {
      const p = document.createElement('p'); p.textContent = 'No external sources were linked in this visible post.'; p.className = 'no-links'; links.replaceChildren(p);
    }
  }
  const signals = [...makeSignals(data), ...(estimate ? estimate.clues : [])];
  document.querySelector('#signals').replaceChildren(...signals.map(s => { const li = document.createElement('li'); li.textContent = s; return li; }));
  document.querySelector('#why-button').onclick = () => {
    const panel = document.querySelector('#why-panel'); const open = panel.hidden;
    panel.hidden = !open;
    document.querySelector('#why-button').textContent = open ? 'Hide why' : 'Why?';
    document.querySelector('#why-button').setAttribute('aria-expanded', String(open));
  };
  document.querySelector('#loading').hidden = true; document.querySelector('#result').hidden = false;
}
async function init() {
  const enabledToggle = document.querySelector('#enabled-toggle');
  const { truthLensEnabled = false } = await chrome.storage.local.get({ truthLensEnabled: false });
  enabledToggle.checked = truthLensEnabled;
  if (!truthLensEnabled) {
    document.querySelector('#loading').hidden = true;
    document.querySelector('#privacy-off').hidden = false;
    return;
  }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const data = await readActiveTab(tab);
    if (!data || data.disabled) throw Error();
    render(data);
  } catch {
    document.querySelector('#loading').hidden = true;
    document.querySelector('#error').hidden = false;
    document.querySelector('#error p').textContent = 'TruthLens cannot read this page. Try a normal article or individual post; Chrome blocks browser settings, the Chrome Web Store, and some protected pages.';
  }
}
document.querySelector('#enabled-toggle').addEventListener('change', async (event) => {
  await chrome.storage.local.set({ truthLensEnabled: event.target.checked });
  if (event.target.checked) {
    document.querySelector('#privacy-off').hidden = true;
    document.querySelector('#error').hidden = true;
    document.querySelector('#loading').hidden = false;
    init();
  } else {
    document.querySelector('#loading').hidden = true;
    document.querySelector('#result').hidden = true;
    document.querySelector('#error').hidden = true;
    document.querySelector('#privacy-off').hidden = false;
  }
});
init();
