module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    const rssRes = await fetch('https://anchor.fm/s/f0d741b4/podcast/rss', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await rssRes.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

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

      // Try to get Spotify episode ID from <spotify:id> or enclosure URL
      const getSpotifyId = () => {
        const spotifyTag = /<spotify:id>([^<]+)<\/spotify:id>/.exec(item);
        if (spotifyTag) return spotifyTag[1].trim();
        // Try from enclosure url pattern: /play/NUMBER/
        const enclosureMatch = /\/play\/(\d+)\//.exec(item);
        return enclosureMatch ? enclosureMatch[1] : null;
      };

      const link = getLinkHref();
      // Extract anchor episode slug for embed fallback
      const slugMatch = link.match(/pod\/show\/([^/]+)\/episodes\/(.+)/);
      const anchorEmbed = slugMatch
        ? `https://anchor.fm/${slugMatch[1]}/embed/episodes/${slugMatch[2]}`
        : null;

      items.push({
        title: get('title'),
        description: get('description'),
        link,
        pubDate: get('pubDate'),
        anchorEmbed,
      });
    }

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
