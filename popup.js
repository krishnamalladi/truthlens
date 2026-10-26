function sourceForHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  const key = Object.keys(TRUTHLENS_REGISTRY).sort((a, b) => b.length - a.length)
    .find(domain => host === domain || host.endsWith(`.${domain}`));
  return key ? TRUTHLENS_REGISTRY[key] : null;
}
function makeSignals(data) {
  const text = data.text.toLowerCase(); const signals = [];
  if (data.social) signals.push('This is a social-media page. Posts can spread before independent verification.');
  if (data.isYouTube && data.captions) signals.push('Available subtitles were read locally as additional context.');
  if (data.isYouTube && !data.captions) signals.push('No readable subtitles are available yet. The title and description were checked instead.');
  if (data.externalLinks >= 3) signals.push('Includes links to outside sources or evidence.'); else signals.push('Few visible links to outside sources—look for original evidence.');
  if (/\b(according to|data from|report|study|documents?)\b/.test(text)) signals.push('References reporting, documents, data, or attributed sources.');
  else signals.push('Limited source-attribution language was detected.');
  if (/\b(opinion|editorial|commentary|analysis)\b/.test(text)) signals.push('May include analysis or opinion—separate it from reported facts.');
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
  const title = (data.title || '').replace(/\s*[|–—-]\s*[^|–—-]+$/, '').trim();
  if (title && title.length > 20) return title.slice(0, 220);
  const sentence = (data.text || '').match(/[^.!?]{30,220}[.!?]/)?.[0];
  return sentence?.trim() || 'TruthLens could not isolate a main claim on this page.';
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
function render(data) {
  const source = sourceForHostname(data.hostname);
  const estimate = source ? null : estimateUnknownSource(data);
  const score = source?.score ?? (data.social ? 30 : estimate.score);
  const notNews = data.isYouTube && looksLikeNonNews(data);
  const credible = !data.social && (source ? source.kind === 'newsroom' && score >= 70 : score >= 65);
  const claim = extractMainClaim(data);
  const risks = safetyCheck(data);
  document.querySelector('#publisher').textContent = source?.name ?? (data.social ? 'Social-media post' : 'Unlisted publisher');
  document.querySelector('#domain').textContent = data.hostname;
  document.querySelector('#score').textContent = source ? `${score}/100` : data.social ? 'Check' : `~${score}/100`;
  const verdict = document.querySelector('#verdict');
  verdict.textContent = notNews ? 'Not news' : credible ? 'Credible' : 'Not credible';
  verdict.classList.toggle('cautious', !credible);
  document.querySelector('#rating').textContent = notNews ? 'This video appears to be entertainment, a tutorial, or another non-news format. That is not a judgment about its quality or accuracy.' : credible ? `${source.tier}. ${source.note}` : (data.social ? 'Social posts are not independently fact-checked by TruthLens. Look for the original source before sharing.' : source ? `${source.tier}. ${source.note}` : `Provisional ${score}/100 estimate based on visible transparency signals. It is not a fact-check or an endorsement of the publisher.`);
  document.querySelector('#headline').textContent = data.title || 'This page';
  const claimsStrip = document.querySelector('#claims-strip');
  claimsStrip.hidden = false;
  document.querySelector('#main-claim').textContent = claim;
  document.querySelector('#claim-status').textContent = data.externalLinks >= 2
    ? 'Verification: source links found — compare them with independent reporting.'
    : 'Verification: no clear independent evidence found on this page.';
  const safetyMessage = document.querySelector('#safety-message');
  safetyMessage.hidden = !risks.length;
  safetyMessage.textContent = risks.length ? `Safety: ${risks.join(', ')} claim — verify before acting or sharing.` : '';
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
  try { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); const data = await chrome.tabs.sendMessage(tab.id, { type: 'GET_ARTICLE_DATA' }); if (!data || data.disabled) throw Error(); render(data); }
  catch { document.querySelector('#loading').hidden = true; document.querySelector('#error').hidden = false; }
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
