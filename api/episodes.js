module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  try {
    const [rssRes, spotifyRes] = await Promise.all([
      fetch('https://anchor.fm/s/f0d741b4/podcast/rss', {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }),
      fetch('https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-MX,es;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      })
    ]);

    const [xml, spotifyHtml] = await Promise.all([rssRes.text(), spotifyRes.text()]);

    // Extract episode IDs from Spotify __NEXT_DATA__ JSON
    const spotifyIds = [];
    const nextDataMatch = /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/.exec(spotifyHtml);
    if (nextDataMatch) {
      try {
        const data = JSON.parse(nextDataMatch[1]);
        const eps = data?.props?.pageProps?.state?.data?.episodes?.items || [];
        eps.forEach(ep => {
          const id = ep?.track?.data?.id || ep?.id;
          if (id) spotifyIds.push(id);
        });
      } catch(e) {}
    }
    // Fallback: regex scan for episode IDs in the page
    if (!spotifyIds.length) {
      const uriRegex = /spotify:episode:([A-Za-z0-9]{22})/g;
      let m;
      const seen = new Set();
      while ((m = uriRegex.exec(spotifyHtml)) !== null) {
        if (!seen.has(m[1])) { seen.add(m[1]); spotifyIds.push(m[1]); }
      }
    }

    // Parse RSS
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let i = 0;

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
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);

      const spotifyId = spotifyIds[i] || null;
      const embedUrl = spotifyId
        ? `https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator&theme=0`
        : null;

      items.push({
        title: get('title'),
        description: get('description'),
        link: getLinkHref(),
        pubDate: get('pubDate'),
        embedUrl,
        duration: durationMatch ? durationMatch[1].slice(0, 5) : '',
      });
      i++;
    }

    res.status(200).json({ items, spotifyIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
