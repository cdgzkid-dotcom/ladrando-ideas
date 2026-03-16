module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    // Fetch RSS and Spotify show page in parallel
    const [rssRes, spotifyRes] = await Promise.all([
      fetch('https://anchor.fm/s/f0d741b4/podcast/rss', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }),
      fetch('https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-MX,es;q=0.9'
        }
      })
    ]);

    const [xml, spotifyHtml] = await Promise.all([rssRes.text(), spotifyRes.text()]);

    // Extract Spotify episode IDs from the show page JSON data
    const spotifyIds = [];
    const nextDataMatch = /"episodeUnionV2":\{"__typename":"Episode","id":"([a-zA-Z0-9]+)"/.exec(spotifyHtml);
    // Grab all episode IDs from the page
    const idRegex = /"id":"([a-zA-Z0-9]{22})"/g;
    const seen = new Set();
    let idMatch;
    // Also try extracting from episode URI pattern
    const uriRegex = /spotify:episode:([a-zA-Z0-9]{22})/g;
    while ((idMatch = uriRegex.exec(spotifyHtml)) !== null) {
      if (!seen.has(idMatch[1])) {
        seen.add(idMatch[1]);
        spotifyIds.push(idMatch[1]);
      }
    }

    // Parse RSS items
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let idx = 0;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
      const item = match[1];

      const get = (tag) => {
        const m = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(item);
        return m ? (m[1] || m[2] || '').trim() : '';
      };

      const getLinkHref = () => {
        const m = /<link>([^<]+)<\/link>/.exec(item) || /<link\s[^>]*href="([^"]+)"/.exec(item);
        return m ? m[1].trim() : '';
      };

      const link = getLinkHref();
      const slugMatch = link.match(/pod\/show\/([^/]+)\/episodes\/(.+)/);
      const anchorEmbed = slugMatch
        ? `https://anchor.fm/${slugMatch[1]}/embed/episodes/${slugMatch[2]}`
        : null;

      // Use Spotify ID if available, else fall back to Anchor embed
      const spotifyId = spotifyIds[idx] || null;
      const embedUrl = spotifyId
        ? `https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator&theme=0`
        : anchorEmbed;

      const durationTag = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);
      const duration = durationTag ? durationTag[1].slice(0, 5) : '';

      items.push({
        title: get('title'),
        description: get('description'),
        link,
        pubDate: get('pubDate'),
        embedUrl,
        duration,
      });
      idx++;
    }

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
