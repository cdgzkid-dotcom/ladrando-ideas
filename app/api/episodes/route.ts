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
      pubDate: string;
      audioUrl: string;
      imageUrl: string;
      duration: string;
    }[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
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

      items.push({
        title: get("title"),
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
