"use client";

import { useState, useRef, useEffect } from "react";

type Episode = {
  title: string;
  guest: string;
  season: number | null;
  episode: number | null;
  pubDate: string;
  audioUrl: string;
  imageUrl: string;
  duration: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Sidebar() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetch("/api/episodes")
      .then((r) => r.json())
      .then((data) => {
        if (data.items) setEpisodes(data.items);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border bg-bg-alt px-5 py-6 space-y-5">
        <DesktopSidebar episodes={episodes} />
      </aside>

      {/* Mobile compact */}
      <div className="lg:hidden bg-bg-alt border-b border-border px-4 py-4">
        <MobileHeader />
      </div>
    </>
  );
}

/* ─── MOBILE ─── */
function MobileHeader() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/images/ladrando-cover.jpg"
        alt="Ladrando Ideas"
        className="w-14 h-14 rounded-xl object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-base font-bold text-primary tracking-tight">
          LADRANDO IDEAS
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <img src="/images/christian.jpg" alt="Christian" className="w-6 h-6 rounded-full object-cover border border-primary" />
          <img src="/images/kiko.jpg" alt="Kiko" className="w-6 h-6 rounded-full object-cover border border-primary" />
          <span className="text-text-sec text-[11px]">Christian y Kiko</span>
        </div>
      </div>

      {/* Platform icons — top right */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a href="https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp" target="_blank" rel="noopener" className="text-text-ter hover:text-[#1DB954] transition-colors" title="Spotify">
          <SpotifyIcon />
        </a>
        <a href="https://podcasts.apple.com/mx/podcast/ladrando-ideas-podcast-de-perros/id1728309744" target="_blank" rel="noopener" className="text-text-ter hover:text-[#D56DFB] transition-colors" title="Apple Podcasts">
          <ApplePodcastsIcon />
        </a>
        <a href="https://music.amazon.com.mx/podcasts/6938af8b-ecf5-4749-8394-439980b32817/ladrando-ideas-podcast-de-perros" target="_blank" rel="noopener" className="text-text-ter hover:text-[#FF9900] transition-colors" title="Amazon Music">
          <AmazonMusicIcon />
        </a>
        <a href="https://www.instagram.com/ladrandoideas" target="_blank" rel="noopener" className="text-text-ter hover:text-[#E4405F] transition-colors" title="@ladrandoideas">
          <InstagramIcon />
        </a>
        <a href="https://wa.me/523338155238" target="_blank" rel="noopener" className="text-text-ter hover:text-[#25D366] transition-colors" title="WhatsApp">
          <WhatsAppIcon />
        </a>
      </div>
    </div>
  );
}

/* ─── DESKTOP ─── */
function DesktopSidebar({ episodes }: { episodes: Episode[] }) {
  return (
    <>
      {/* 1. PORTADA */}
      <img
        src="/images/ladrando-cover.jpg"
        alt="Ladrando Ideas"
        className="w-full aspect-square object-cover"
        style={{ borderRadius: 12 }}
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.background = "linear-gradient(135deg, #1A5FA8 0%, #2D7DD2 50%, #0F1419 100%)";
          el.style.minHeight = "240px";
        }}
      />

      {/* 2. HOSTS */}
      <Section label="Hosts">
        <div className="space-y-3">
          <HostRow img="/images/christian.jpg" initials="CD" name="Christian Dominguez" />
          <HostRow img="/images/kiko.jpg" initials="KA" name="Kiko (Rodolfo Ascencio)" />
        </div>
      </Section>

      {/* 3. ESCUCHANOS EN */}
      <Section label="Escuchanos en">
        <div className="space-y-2">
          <PlatformButton href="https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp" icon={<SpotifyIcon />} label="Spotify" />
          <PlatformButton href="https://podcasts.apple.com/mx/podcast/ladrando-ideas-podcast-de-perros/id1728309744" icon={<ApplePodcastsIcon />} label="Apple Podcasts" />
          <PlatformButton href="https://music.amazon.com.mx/podcasts/6938af8b-ecf5-4749-8394-439980b32817/ladrando-ideas-podcast-de-perros" icon={<AmazonMusicIcon />} label="Amazon Music" />
          <PlatformButton href="https://www.instagram.com/ladrandoideas" icon={<InstagramIcon />} label="@ladrandoideas" />
          <PlatformButton href="https://wa.me/523338155238" icon={<WhatsAppIcon />} label="WhatsApp" />
        </div>
      </Section>

      {/* 4. EPISODIOS ANTERIORES */}
      {episodes.length > 0 && (
        <Section label="Episodios anteriores">
          <div className="space-y-4">
            {episodes.map((ep, i) => (
              <EpisodeRow key={i} episode={ep} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

/* ─── SHARED COMPONENTS ─── */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-text-ter text-[10px] uppercase tracking-widest font-semibold mb-3">
        {label}
      </p>
      {children}
    </div>
  );
}

function HostRow({ img, initials, name }: { img: string; initials: string; name: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {!imgError ? (
        <img
          src={img}
          alt={name}
          className="w-[48px] h-[48px] rounded-full object-cover shrink-0 border-2 border-primary"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-[48px] h-[48px] rounded-full border-2 border-primary flex items-center justify-center shrink-0"
          style={{ background: "rgba(45,125,210,0.15)" }}
        >
          <span className="text-primary font-bold text-sm">{initials}</span>
        </div>
      )}
      <span className="text-text-pri text-sm font-medium">{name}</span>
    </div>
  );
}

function PlatformButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex items-center gap-2.5 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text-sec hover:border-primary-border hover:text-primary transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}

function EpisodeRow({ episode }: { episode: Episode }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  function togglePlay() {
    if (!episode.audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(episode.audioUrl);
      audioRef.current.addEventListener("timeupdate", () => {
        const a = audioRef.current;
        if (!a) return;
        const pct = a.duration ? (a.currentTime / a.duration) * 100 : 0;
        setProgress(pct);
        const m = Math.floor(a.currentTime / 60);
        const s = Math.floor(a.currentTime % 60);
        setCurrentTime(`${m}:${s.toString().padStart(2, "0")}`);
      });
      audioRef.current.addEventListener("ended", () => {
        setPlaying(false);
        setProgress(0);
        setCurrentTime("0:00");
      });
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  const epLabel = [
    episode.season ? `T${episode.season}` : null,
    episode.episode ? `Ep. ${episode.episode}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {/* Play button */}
        <button
          onClick={togglePlay}
          className={`w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            playing ? "bg-primary/80" : "bg-primary"
          } hover:brightness-110`}
        >
          {playing ? (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {epLabel && (
            <p className="text-primary text-[11px] font-semibold">{epLabel}</p>
          )}
          {episode.guest && (
            <p className="text-text-pri text-sm font-bold leading-snug">
              {episode.guest}
            </p>
          )}
          <p className="text-text-sec text-xs leading-snug mt-0.5" style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {episode.title}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {(playing || progress > 0) && (
        <div className="flex items-center gap-2 pl-[52px]">
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-text-ter text-[10px] tabular-nums">{currentTime}</span>
        </div>
      )}
    </div>
  );
}

/* ─── ICONS ─── */

function SpotifyIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function ApplePodcastsIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.292 1.002-.818 1.002-.42 0-.742-.27-.85-.748-.272-1.194-.87-2.434-1.79-3.378-1.344-1.404-3.053-2.16-4.862-2.16-1.809 0-3.518.756-4.862 2.16-.921.944-1.518 2.184-1.79 3.378-.108.478-.43.748-.85.748-.526 0-.937-.413-.818-1.002.352-1.773 1.04-3.12 2.264-4.392 1.608-1.685 3.72-2.587 6.056-2.587zM11.865 15.8c-.618 0-1.09.542-1.476 1.218-.402.706-.662 1.672-.662 2.727 0 1.425.754 2.073 2.138 2.073s2.138-.648 2.138-2.073c0-1.055-.26-2.02-.662-2.727-.386-.676-.858-1.218-1.476-1.218zm0-2.013c1.208 0 2.188.478 2.916 1.378.544.672.91 1.49 1.134 2.39.336 1.352.025 2.986-.914 3.86-.538.5-1.258.767-2.044.767h-2.184c-.786 0-1.506-.266-2.044-.768-.939-.873-1.25-2.507-.914-3.86.223-.899.59-1.717 1.134-2.389.728-.9 1.708-1.378 2.916-1.378zm0-5.154c1.46 0 2.722.552 3.684 1.554.876.912 1.38 2.04 1.596 3.342.072.432-.21.816-.66.816-.348 0-.654-.234-.72-.636-.144-.93-.516-1.74-1.14-2.388-.756-.792-1.686-1.206-2.76-1.206s-2.004.414-2.76 1.206c-.624.648-.996 1.458-1.14 2.388-.066.402-.372.636-.72.636-.45 0-.732-.384-.66-.816.216-1.302.72-2.43 1.596-3.342.962-1.002 2.224-1.554 3.684-1.554z" />
    </svg>
  );
}

function AmazonMusicIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.045 18.02c.07-.116.157-.228.185-.301.015-.04.035-.04.07-.012 2.225 1.72 4.728 2.88 7.543 3.376a15.149 15.149 0 006.17-.065 14.425 14.425 0 006.27-3.13c.13-.107.19-.12.27.007.48.68.95 1.37 1.44 2.05.07.1.06.16-.04.24a17.661 17.661 0 01-7.47 3.76 17.08 17.08 0 01-6.48.31 17.357 17.357 0 01-7.37-2.92c-.2-.15-.39-.32-.58-.49zM12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14.5v-9l7 4.5-7 4.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
