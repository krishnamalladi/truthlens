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
function render(data) {
  const source = sourceForHostname(data.hostname);
  const score = source?.score ?? (data.social ? 30 : 50);
  const notNews = data.isYouTube && looksLikeNonNews(data);
  const credible = Boolean(source?.kind === 'newsroom' && score >= 70 && !data.social);
  document.querySelector('#publisher').textContent = source?.name ?? (data.social ? 'Social-media post' : 'Unlisted publisher');
  document.querySelector('#domain').textContent = data.hostname;
  document.querySelector('#score').textContent = source ? `${score}/100` : 'Check';
  const verdict = document.querySelector('#verdict');
  verdict.textContent = notNews ? 'Not news content' : credible ? 'Looks credible' : 'Needs verification';
  verdict.classList.toggle('cautious', !credible);
  document.querySelector('#rating').textContent = notNews ? 'This video appears to be entertainment, a tutorial, or another non-news format. That is not a judgment about its quality or accuracy.' : credible ? `${source.tier}. ${source.note}` : (data.social ? 'Social posts are not independently fact-checked by TruthLens. Look for the original source before sharing.' : source ? `${source.tier}. ${source.note}` : 'TruthLens has no source profile for this publisher. This is not proof that the claim is false.');
  document.querySelector('#headline').textContent = data.title || 'This page';
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
  document.querySelector('#signals').replaceChildren(...makeSignals(data).map(s => { const li = document.createElement('li'); li.textContent = s; return li; }));
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
