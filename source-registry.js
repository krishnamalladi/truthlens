/* TruthLens Source Registry. Scores measure source transparency and newsroom
 * structure—not whether a particular claim is true. Below 70: Needs verification. */
const localNewsroom = (name) => ({ name, score: 65, kind: 'newsroom', tier: 'Local or specialist newsroom', note: 'A recognized newsroom, but important claims should still be checked against original documents and independent reporting.' });
const mixedPublication = (name) => ({ name, score: 60, kind: 'newsroom', tier: 'News and opinion publication', note: 'Publishes reporting alongside analysis, commentary, or culture coverage. Check article labels, bylines, and original sources.' });

const TRUTHLENS_REGISTRY = {
  'apnews.com': { name: 'Associated Press', score: 90, kind: 'newsroom', tier: 'Established wire service', note: 'Published reporting standards, corrections process, and broad original reporting.' },
  'reuters.com': { name: 'Reuters', score: 90, kind: 'newsroom', tier: 'Established wire service', note: 'Published reporting standards, corrections process, and broad original reporting.' },
  'bbc.com': { name: 'BBC News', score: 82, kind: 'newsroom', tier: 'Public-service newsroom', note: 'Published editorial guidelines and a visible corrections process.' },
  'npr.org': { name: 'NPR', score: 82, kind: 'newsroom', tier: 'Public-service newsroom', note: 'Published editorial standards and a visible corrections process.' },
  'pbs.org': { name: 'PBS NewsHour', score: 82, kind: 'newsroom', tier: 'Public-service newsroom', note: 'Published editorial standards and regular source attribution.' },
  'nytimes.com': { name: 'The New York Times', score: 78, kind: 'newsroom', tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'washingtonpost.com': { name: 'The Washington Post', score: 78, kind: 'newsroom', tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'theguardian.com': { name: 'The Guardian', score: 78, kind: 'newsroom', tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'wsj.com': { name: 'The Wall Street Journal', score: 78, kind: 'newsroom', tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'nbcnews.com': { name: 'NBC News', score: 75, kind: 'newsroom', tier: 'Established newsroom', note: 'National newsroom with named editorial leadership and a public route for reporting errors.' },
  'abcnews.go.com': { name: 'ABC News', score: 75, kind: 'newsroom', tier: 'Established newsroom', note: 'National broadcast and digital newsroom; verify important claims with primary sources.' },
  'latimes.com': { name: 'Los Angeles Times', score: 75, kind: 'newsroom', tier: 'Established newsroom', note: 'Published ethics guidelines, source-attribution standards, and corrections practices.' },
  'usatoday.com': { name: 'USA Today', score: 75, kind: 'newsroom', tier: 'Established newsroom', note: 'Bylined reporting and published newsroom standards and corrections practices.' },
  'cbsnews.com': { name: 'CBS News', score: 75, kind: 'newsroom', tier: 'Established newsroom', note: 'Published standards, ethics policy, and a corrections process.' },
  'politico.com': { name: 'POLITICO', score: 72, kind: 'newsroom', tier: 'Specialist newsroom', note: 'Politics and policy newsroom; distinguish reporting from analysis and opinion.' },
  'cnn.com': { name: 'CNN', score: 70, kind: 'newsroom', tier: 'Established newsroom', note: 'Published newsroom practices; distinguish reporting from analysis and opinion.' },
  'espn.com': { name: 'ESPN', score: 68, kind: 'newsroom', tier: 'Specialist newsroom', note: 'Sports newsroom; use original league, team, and event sources for major claims.' },
  'foxnews.com': { name: 'Fox News', score: 65, kind: 'newsroom', tier: 'Established newsroom', note: 'Distinguish news reporting from analysis and opinion.' },
  'huffpost.com': mixedPublication('HuffPost'), 'usnews.com': { name: 'U.S. News & World Report', score: 65, kind: 'newsroom', tier: 'News and rankings publication', note: 'Check ranking methodology and original sources.' }, 'vox.com': mixedPublication('Vox'), 'washingtontimes.com': mixedPublication('The Washington Times'), 'laweekly.com': mixedPublication('L.A. Weekly'), 'observer.com': mixedPublication('Observer'), 'nypost.com': mixedPublication('New York Post'), 'newsweek.com': mixedPublication('Newsweek'), 'salon.com': mixedPublication('Salon'), 'chicagoreader.com': mixedPublication('Chicago Reader'), 'metrotimes.com': mixedPublication('Detroit Metro Times'), 'texasobserver.org': mixedPublication('The Texas Observer'),
  'breitbart.com': { name: 'Breitbart News', score: 55, kind: 'newsroom', tier: 'News and opinion publication', note: 'Use primary sources and independent reporting for important claims.' },
  'theintercept.com': { name: 'The Intercept', score: 65, kind: 'newsroom', tier: 'Investigative news publication', note: 'Review linked documents and seek corroborating reporting.' },
  'mercurynews.com': localNewsroom('The Mercury News'), 'chicagotribune.com': localNewsroom('Chicago Tribune'), 'suntimes.com': localNewsroom('Chicago Sun-Times'), 'boston.com': localNewsroom('Boston.com'), 'seattletimes.com': localNewsroom('The Seattle Times'), 'miamiherald.com': localNewsroom('Miami Herald'), 'newsday.com': localNewsroom('Newsday'), 'dailyherald.com': localNewsroom('Daily Herald'), 'nydailynews.com': localNewsroom('New York Daily News'), 'twincities.com': localNewsroom('Pioneer Press'), 'minnpost.com': localNewsroom('MinnPost'), 'timesofsandiego.com': localNewsroom('Times of San Diego'), 'miamitodaynews.com': localNewsroom('Miami Today'), 'phillyvoice.com': localNewsroom('PhillyVoice'), 'autonews.com': localNewsroom('Automotive News'),
  'ktla.com': localNewsroom('KTLA'), 'abc13.com': localNewsroom('ABC13 Houston'), 'kxan.com': localNewsroom('KXAN News'), 'nbcnewyork.com': localNewsroom('NBC New York'), 'nbcchicago.com': localNewsroom('NBC Chicago'), 'kdvr.com': localNewsroom('FOX31 Denver'), 'wfla.com': localNewsroom('WFLA News Channel 8'), 'nbclosangeles.com': localNewsroom('NBC Los Angeles'), 'kron4.com': localNewsroom('KRON4'), 'abc7news.com': localNewsroom('ABC7 San Francisco'), 'nbcdfw.com': localNewsroom('NBC 5 Dallas-Fort Worth'), 'nbcwashington.com': localNewsroom('NBC4 Washington'), 'fox5sandiego.com': localNewsroom('FOX 5 San Diego'), 'fox2now.com': localNewsroom('FOX 2 St. Louis'), 'nbcsandiego.com': localNewsroom('NBC 7 San Diego'), 'nbcphiladelphia.com': localNewsroom('NBC10 Philadelphia'), 'wsvn.com': localNewsroom('WSVN 7 News Miami'), 'nbcmiami.com': localNewsroom('NBC 6 South Florida'), 'wivb.com': localNewsroom('WIVB-TV'), 'whdh.com': localNewsroom('7News Boston'), 'news10.com': localNewsroom('NEWS10 ABC'), 'wgntv.com': localNewsroom('WGN-TV'),
  'publishedreporter.com': { name: 'The Published Reporter', score: 50, kind: 'newsroom', tier: 'Limited-confidence publication', note: 'TruthLens has limited information about its editorial standards and corrections practices. Verify independently.' },
  'yahoo.com': { name: 'Yahoo', score: 50, kind: 'portal', tier: 'News portal', note: 'A portal carrying material from multiple publishers. Check the byline and original publisher for each item.' },
  'wikipedia.org': { name: 'Wikipedia', score: 50, kind: 'reference', tier: 'Community-edited reference', note: 'Useful for orientation and citations, but entries can change. Open and assess cited original sources.' },
  'youtube.com': { name: 'YouTube videos and Shorts', score: 30, kind: 'platform', tier: 'User-uploaded platform', note: 'Videos can be uploaded without editorial review. Check the creator, original evidence, and independent reporting.' },
  'facebook.com': { name: 'Facebook posts', score: 30, kind: 'platform', tier: 'User-posted platform', note: 'Posts can be published without editorial review. Check the original source and independent reporting.' },
  'headtopics.com': { name: 'Head Topics', score: 40, kind: 'portal', tier: 'News aggregation platform', note: 'Aggregates headlines and stories. Open the original publisher and verify primary reporting.' }
};

// AhrefsTop's worldwide top-100 list is based on estimated search traffic.
// These domains are recognized, but traffic is not evidence of reliability.
for (const domain of [
  'globo.com', 'bbc.co.uk', 'uol.com.br', 'sambad.com', 'interia.pl', 'msn.com',
  'detik.com', 'hurriyet.com.tr', 'kompas.com', 'conectate.com.do', 'wp.pl', 'bild.de',
  'ctvnews.ca', 'ouest-france.fr', 'baomoi.com', 'milliyet.com.tr', 'kapook.com',
  'tribunnews.com', 'vnexpress.net', 'indiatoday.in', 'hindustantimes.com', 'infobae.com',
  'corriere.it', 'halktv.com.tr', 'ndtv.com', 'lefigaro.fr', 'sabah.com.tr', 'baoquocte.vn',
  '24h.com.vn', 'sozcu.com.tr', 'n-tv.de', 'terra.com.br', 'news18.com', 'sondakika.com',
  't-online.de', 'tvn24.pl', 'timesnownews.com', 'thairath.co.th', 'vietnamnet.vn', 'elpais.com',
  'iltalehti.fi', 'thesun.co.uk', 'spiegel.de', 'abplive.com', 'repubblica.it', 'franceinfo.fr',
  'bhaskar.com', 'kumparan.com', 'ynet.co.il', 'aol.com', 'indianexpress.com', 'cnnbrasil.com.br',
  'aajtak.in', 'bfmtv.com', 'aljazeera.com', 'ukr.net', 'protothema.gr', 'liputan6.com',
  'tagesschau.de', 'asahi.com', 'thehindu.com', 'youm7.com', 'elmundo.es', 'thanhnien.vn',
  'expressen.se', 'aftonbladet.se', 'lavanguardia.com', 'haber7.com', 'ad.nl', 'abril.com.br',
  'haberturk.com', 'lanacion.com.ar', 'cnnturk.com', 'udn.com', 'welt.de', 'tuoitre.vn',
  'express.co.uk', 'is.fi', 'abc.net.au', 'estadao.com.br', 'hln.be', 'ndr.de', 'vg.no',
  'ntv.com.tr', 'nu.nl', 'livehindustan.com', 'clarin.com', 'lemonde.fr'
]) {
  if (!TRUTHLENS_REGISTRY[domain]) {
    TRUTHLENS_REGISTRY[domain] = {
      name: domain,
      score: 60,
      kind: 'newsroom',
      tier: 'International news source — limited confidence',
      note: 'Listed by AhrefsTop for search traffic. Traffic is not evidence of accuracy; verify important claims with primary sources and independent reporting.'
    };
  }
}
