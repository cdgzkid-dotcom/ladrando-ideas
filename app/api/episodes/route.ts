import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rssRes = await fetch("https://anchor.fm/s/f0d741b4/podcast/rss", {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 300 },
    });
    const xml = await rssRes.text();

    const items: {
      title: string;
      guest: string;
      season: number | null;
      episode: number | null;
      pubDate: string;
      audioUrl: string;
      imageUrl: string;
      duration: string;
    }[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
      const item = match[1];
      const get = (tag: string) => {
        const m = new RegExp(
          `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`
        ).exec(item);
        return m ? (m[1] || m[2] || "").trim() : "";
      };
      const audioMatch = /<enclosure\s[^>]*url="([^"]+)"/.exec(item);
      const imageMatch = /<itunes:image\s[^>]*href="([^"]+)"/.exec(item);
      const durationMatch = /<itunes:duration>([^<]+)<\/itunes:duration>/.exec(item);

      const rawTitle = get("title");

      // Parse "T3 E8 — Guest Name | Topic" or similar patterns
      let season: number | null = null;
      let episode: number | null = null;
      let guest = "";
      const epMatch = rawTitle.match(/T(\d+)\s*E(\d+)/i);
      if (epMatch) {
        season = parseInt(epMatch[1], 10);
        episode = parseInt(epMatch[2], 10);
      }
      // Extract guest: text after "—" or "-" before "|"
      const guestMatch = rawTitle.match(/[—–-]\s*(.+?)(?:\s*\||$)/);
      if (guestMatch) {
        guest = guestMatch[1].trim();
      }

      const seasonMatch = /<itunes:season>(\d+)<\/itunes:season>/.exec(item);
      const episodeMatch = /<itunes:episode>(\d+)<\/itunes:episode>/.exec(item);
      if (!season && seasonMatch) season = parseInt(seasonMatch[1], 10);
      if (!episode && episodeMatch) episode = parseInt(episodeMatch[1], 10);

      items.push({
        title: rawTitle,
        guest,
        season,
        episode,
        pubDate: get("pubDate"),
        audioUrl: audioMatch ? audioMatch[1].trim() : "",
        imageUrl: imageMatch ? imageMatch[1].trim() : "",
        duration: durationMatch ? durationMatch[1] : "",
      });
    }

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
