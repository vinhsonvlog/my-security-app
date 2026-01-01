// Trusted domains that should never be marked as dangerous
const TRUSTED_DOMAINS = [
  'google.com',
  'gmail.com',
  'facebook.com',
  'youtube.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'microsoft.com',
  'apple.com',
  'amazon.com',
  'github.com',
  'stackoverflow.com',
  'wikipedia.org',
  'reddit.com',
  'tiktok.com',
  'zoom.us',
  'dropbox.com',
  'netflix.com',
  'spotify.com',
  'twitch.tv',
  'discord.com',
  'slack.com',
  'paypal.com'
];

const isTrustedDomain = (url) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname.toLowerCase();
    
    return TRUSTED_DOMAINS.some(trusted => 
      hostname === trusted || 
      hostname.endsWith(`.${trusted}`)
    );
  } catch {
    return false;
  }
};

const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  let normalized = url.trim().toLowerCase();

  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  // Remove www prefix
  normalized = normalized.replace(/^www\./, '');
  // Remove trailing slashes only
  normalized = normalized.replace(/\/+$/, '');
  // Keep query params and hash for more accurate matching

  return normalized;
};

const extractDomain = (url) => {
  const normalized = normalizeUrl(url);
  const parts = normalized.split('/');
  return parts[0];
};

const isSameUrl = (url1, url2) => {
  return normalizeUrl(url1) === normalizeUrl(url2);
};

const isSameDomain = (url1, url2) => {
  return extractDomain(url1) === extractDomain(url2);
};

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    // Try to parse as URL
    const urlToParse = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(urlToParse);
    
    // Check if it has a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }
    
    // Must have at least one dot in hostname (e.g., google.com) or be localhost
    if (urlObj.hostname !== 'localhost' && !urlObj.hostname.includes('.')) {
      return false;
    }
    
    return true;
  } catch {
    // If URL parsing fails, try basic pattern matching for domains
    const domainPattern = /^([\da-z\.-]+)\.([a-z\.]{2,})$/i;
    return domainPattern.test(url.trim());
  }
};

const addProtocol = (url) => {
  if (!url) return '';
  
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
};

module.exports = {
  normalizeUrl,
  extractDomain,
  isSameUrl,
  isSameDomain,
  isValidUrl,
  addProtocol,
  isTrustedDomain,
  TRUSTED_DOMAINS,
};
