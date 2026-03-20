module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const rssRes = await fetch('https://anchor.fm/s/f0d741b4/podcast/rss', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await rssRes.text();

    // Extract season from channel-level itunes:season or first episode title (e.g. "T3 E8" → 3)
    let season = null;
    const channelSeasonMatch = /<itunes:season>(\d+)<\/itunes:season>/.exec(xml);
    if (channelSeasonMatch) {
      season = parseInt(channelSeasonMatch[1], 10);
    }

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
      const item = match[1];
      const get = (tag) => {
        const m = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(item);
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      const linkMatch = /<link>([^<]+)<\/link>/.exec(item);
      const audioMatch = /<enclosure\s[^>]*url="([^"]+)"/.exec(item);
      const imageMatch = /<itunes:image\s[^>]*href="([^"]+)"/.exec(item);
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);

      const title = get('title');

      // If no channel-level season, extract from first episode title (T3 E8 → 3)
      if (season === null && items.length === 0) {
        const titleSeasonMatch = /\bT(\d+)\s*E\d+/i.exec(title);
        if (titleSeasonMatch) season = parseInt(titleSeasonMatch[1], 10);
      }

      items.push({
        title,
        description: get('description'),
        link: linkMatch ? linkMatch[1].trim() : '',
        pubDate: get('pubDate'),
        audioUrl: audioMatch ? audioMatch[1].trim() : '',
        imageUrl: imageMatch ? imageMatch[1].trim() : '',
        duration: durationMatch ? durationMatch[1] : '',
      });
    }

    res.status(200).json({ items, season });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
