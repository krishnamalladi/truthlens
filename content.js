(() => {
  function getCaptionText(video) {
    if (!video?.textTracks) return '';
    const captions = [];
    for (const track of video.textTracks) {
      if (track.kind !== 'captions' && track.kind !== 'subtitles') continue;
      try {
        // Hidden loads a subtitle track without displaying a second caption layer.
        if (track.mode === 'disabled') track.mode = 'hidden';
        for (const cue of track.cues || []) captions.push(cue.text);
      } catch { /* Some player tracks are not accessible until they finish loading. */ }
    }
    return [...new Set(captions)].join(' ').replace(/\s+/g, ' ').trim().slice(0, 12000);
  }

  function prepareYouTubeReplayNotice() {
    const video = document.querySelector('video');
    if (!video || video.dataset.truthlensMonitored) return;
    video.dataset.truthlensMonitored = 'true';
    video.addEventListener('ended', () => {
      const notice = document.createElement('div');
      notice.textContent = 'TruthLens: video details are ready. Click the TruthLens icon to review them.';
      Object.assign(notice.style, { position: 'fixed', right: '18px', bottom: '18px', zIndex: '2147483647', maxWidth: '300px', padding: '12px 14px', borderRadius: '12px', background: '#fff9ff', color: '#45365d', boxShadow: '0 8px 28px rgba(53,35,85,.25)', font: '600 13px system-ui' });
      document.body.append(notice);
      setTimeout(() => notice.remove(), 7000);
    }, { once: true });
  }

  function articleData() {
    const social = /(^|\.)(x\.com|twitter\.com|facebook\.com|instagram\.com|tiktok\.com|reddit\.com|youtube\.com|threads\.net)$/.test(location.hostname);
    const isYouTube = /(^|\.)youtube\.com$/.test(location.hostname);
    const youtubeTitle = document.querySelector('ytd-watch-metadata h1 yt-formatted-string, ytd-reel-player-overlay-renderer h2, #title h1');
    const youtubeDescription = document.querySelector('#description-inline-expander, ytd-text-inline-expander#description, ytd-reel-player-overlay-renderer #description');
    const post = isYouTube
      ? (youtubeDescription || youtubeTitle || document.querySelector('ytd-watch-metadata, ytd-reel-player-overlay-renderer'))
      : social && document.querySelector('[data-testid="tweetText"], [data-ad-preview="message"], [role="article"], [data-e2e="browse-video-desc"], [data-e2e="video-desc"]');
    const article = post || document.querySelector('article') || document.querySelector('[role="main"]') || document.body;
    const title = youtubeTitle?.innerText || document.querySelector('meta[property="og:title"]')?.content || document.querySelector('meta[name="twitter:title"]')?.content || article.querySelector('h1')?.innerText || document.querySelector('h1')?.innerText || document.title;
    const youtubeText = [youtubeTitle?.innerText, youtubeDescription?.innerText].filter(Boolean).join('\n\n');
    const text = (youtubeText || article?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30000);
    const captions = isYouTube ? getCaptionText(document.querySelector('video')) : '';
    if (isYouTube) prepareYouTubeReplayNotice();
    const links = [...article.querySelectorAll('a[href]')];
    const outboundUrls = [...new Set(links.map(a => a.href).filter(href => {
      try { const url = new URL(href); return /^https?:$/.test(url.protocol) && url.hostname !== location.hostname; } catch { return false; }
    }))].slice(0, 5);
    const allLinks = [...document.querySelectorAll('a[href]')];
    const transparencyLinks = allLinks.filter(link => /\b(about|contact|editorial|standards|corrections?|ethics|privacy|masthead|ownership)\b/i.test(`${link.textContent} ${link.href}`)).length;
    const author = document.querySelector('meta[name="author"], meta[property="article:author"], [rel="author"], .byline, [class*="byline"]')?.content || document.querySelector('[rel="author"], .byline, [class*="byline"]')?.textContent?.trim() || '';
    const date = document.querySelector('meta[property="article:published_time"], meta[name="date"], time[datetime]')?.content || document.querySelector('time[datetime]')?.dateTime || '';
    return { title: title.trim(), text, captions, isYouTube, author, date, transparencyLinks, externalLinks: outboundUrls.length, outboundUrls, url: location.href, hostname: location.hostname, social };
  }
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_ARTICLE_DATA') {
      // Defense in depth: do not read the document unless the user enabled it.
      chrome.storage.local.get({ truthLensEnabled: false }).then(({ truthLensEnabled }) => {
        sendResponse(truthLensEnabled ? articleData() : { disabled: true });
      });
      return true;
    }
  });
})();
