/*
 * TruthLens Source Registry
 *
 * This is a local, curated reference list maintained with the extension.
 * A score is a transparency/reliability indicator, not a verdict on a claim.
 * Registry criteria: published standards, visible corrections process,
 * professional reporting structure, and a history of linking/attributing sources.
 */
const TRUTHLENS_REGISTRY = {
  'apnews.com': { name: 'Associated Press', score: 90, tier: 'Established wire service', note: 'Published reporting standards, corrections process, and broad original reporting.' },
  'reuters.com': { name: 'Reuters', score: 90, tier: 'Established wire service', note: 'Published reporting standards, corrections process, and broad original reporting.' },
  'bbc.com': { name: 'BBC News', score: 82, tier: 'Public-service newsroom', note: 'Published editorial guidelines and a visible corrections process.' },
  'npr.org': { name: 'NPR', score: 82, tier: 'Public-service newsroom', note: 'Published editorial standards and a visible corrections process.' },
  'pbs.org': { name: 'PBS NewsHour', score: 82, tier: 'Public-service newsroom', note: 'Published editorial standards and regular source attribution.' },
  'nytimes.com': { name: 'The New York Times', score: 78, tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'washingtonpost.com': { name: 'The Washington Post', score: 78, tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'theguardian.com': { name: 'The Guardian', score: 78, tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'wsj.com': { name: 'The Wall Street Journal', score: 78, tier: 'Established newsroom', note: 'Published standards, corrections, and bylined reporting.' },
  'cnn.com': { name: 'CNN', score: 70, tier: 'Established newsroom', note: 'Published newsroom practices; distinguish reporting from analysis and opinion.' },
  'foxnews.com': { name: 'Fox News', score: 65, tier: 'Established newsroom', note: 'Published newsroom practices; distinguish reporting from analysis and opinion.' },
  'youtube.com': { name: 'YouTube videos and Shorts', score: 54, tier: 'Low-confidence source', note: 'Videos can be uploaded without editorial review. Check the creator, original evidence, and independent reporting.' }
};
