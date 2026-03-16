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
      const linkMatch = /<link>([^<]+)<\/link>/.exec(item);
      const audioMatch = /<enclosure\s[^>]*url="([^"]+)"/.exec(item);
      const imageMatch = /<itunes:image\s[^>]*href="([^"]+)"/.exec(item);
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);

      items.push({
        title: get('title'),
        description: get('description'),
        link: linkMatch ? linkMatch[1].trim() : '',
        pubDate: get('pubDate'),
        audioUrl: audioMatch ? audioMatch[1].trim() : '',
        imageUrl: imageMatch ? imageMatch[1].trim() : '',
        duration: durationMatch ? durationMatch[1] : '',
      });
    }

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
