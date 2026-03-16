module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    const rssRes = await fetch('https://anchor.fm/s/f0d741b4/podcast/rss', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await rssRes.text();

    // Parse first 3 RSS items
    const rawItems = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && rawItems.length < 3) {
      const item = match[1];
      const get = (tag) => {
        const m = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(item);
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      const linkMatch = /<link>([^<]+)<\/link>/.exec(item);
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);
      rawItems.push({
        title: get('title'),
        description: get('description'),
        link: linkMatch ? linkMatch[1].trim() : '',
        pubDate: get('pubDate'),
        duration: durationMatch ? durationMatch[1].slice(0, 5) : '',
      });
    }

    // For each episode, fetch its page to find the open.spotify.com episode ID
    const items = await Promise.all(rawItems.map(async (ep) => {
      let embedUrl = null;
      try {
        const epRes = await fetch(ep.link, {
          redirect: 'follow',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const html = await epRes.text();
        // Look for open.spotify.com/episode/ID in og:url, canonical, or any href
        const patterns = [
          /open\.spotify\.com\/episode\/([A-Za-z0-9]{22})/,
          /"spotify:episode:([A-Za-z0-9]{22})"/,
        ];
        for (const pat of patterns) {
          const m = pat.exec(html);
          if (m) { embedUrl = `https://open.spotify.com/embed/episode/${m[1]}?utm_source=generator&theme=0`; break; }
        }
        // Fallback: use the final URL if it redirected to open.spotify.com
        if (!embedUrl && epRes.url && epRes.url.includes('open.spotify.com/episode/')) {
          const m = /open\.spotify\.com\/episode\/([A-Za-z0-9]{22})/.exec(epRes.url);
          if (m) embedUrl = `https://open.spotify.com/embed/episode/${m[1]}?utm_source=generator&theme=0`;
        }
      } catch(e) {}
      return { ...ep, embedUrl };
    }));

    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
