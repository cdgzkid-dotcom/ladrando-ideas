"use client";

import type { Script } from "@/lib/supabase";

type RecentEpisode = Pick<
  Script,
  "id" | "title" | "guest_name" | "episode_number" | "season_number" | "status" | "share_token"
>;

export default function Sidebar({
  recentEpisodes,
  currentToken,
}: {
  recentEpisodes: RecentEpisode[];
  currentToken: string;
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border bg-bg-alt p-6 space-y-6">
        <SidebarContent
          recentEpisodes={recentEpisodes}
          currentToken={currentToken}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-bg-alt border-b border-border p-4">
        <MobileHeader />
      </div>
    </>
  );
}

function MobileHeader() {
  return (
    <div className="flex items-center gap-4">
      {/* Cover */}
      <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary-border flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src="/images/ladrando-cover.png"
          alt="Ladrando Ideas"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.innerHTML =
              '<span style="font-size:24px">🐾</span>';
          }}
        />
      </div>

      <div className="min-w-0">
        <h2 className="font-display text-base font-bold text-primary tracking-tight">
          LADRANDO IDEAS
        </h2>
        <p className="text-text-sec text-xs">
          Christian Dominguez y Kiko
        </p>
        <div className="flex gap-2 mt-1.5">
          <a
            href="https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp"
            target="_blank"
            rel="noopener"
            className="text-[10px] text-text-ter hover:text-primary transition-colors"
          >
            Spotify
          </a>
          <a
            href="https://www.instagram.com/ladrandoideas"
            target="_blank"
            rel="noopener"
            className="text-[10px] text-text-ter hover:text-primary transition-colors"
          >
            @ladrandoideas
          </a>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  recentEpisodes,
  currentToken,
}: {
  recentEpisodes: RecentEpisode[];
  currentToken: string;
}) {
  return (
    <>
      {/* Cover */}
      <div className="w-full aspect-square rounded-xl bg-primary/20 border border-primary-border overflow-hidden">
        <img
          src="/images/ladrando-cover.png"
          alt="Ladrando Ideas"
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            el.parentElement!.innerHTML =
              '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:64px">🐾</div>';
          }}
        />
      </div>

      {/* Podcast name */}
      <div>
        <h2 className="font-display text-xl font-bold text-primary tracking-tight">
          LADRANDO IDEAS
        </h2>
        <p className="text-text-sec text-xs mt-1">
          Podcast sobre perros, mascotas y bienestar animal
        </p>
      </div>

      {/* Hosts */}
      <div>
        <p className="text-text-ter text-[10px] uppercase tracking-wider font-semibold mb-2">
          Hosts
        </p>
        <div className="space-y-1.5">
          <p className="text-text-pri text-sm">Christian Dominguez</p>
          <p className="text-text-pri text-sm">Kiko (Rodolfo Ascencio)</p>
        </div>
      </div>

      {/* Platforms */}
      <div>
        <p className="text-text-ter text-[10px] uppercase tracking-wider font-semibold mb-2">
          Escuchanos en
        </p>
        <div className="space-y-1.5">
          <a
            href="https://open.spotify.com/show/0So9xpkBJmSJrPwqkKh5Bp"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 text-sm text-text-sec hover:text-primary transition-colors"
          >
            <SpotifyIcon />
            Spotify
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-text-sec hover:text-primary transition-colors"
          >
            <ApplePodcastsIcon />
            Apple Podcasts
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-text-sec hover:text-primary transition-colors"
          >
            <AmazonMusicIcon />
            Amazon Music
          </a>
        </div>
      </div>

      {/* Social */}
      <div>
        <p className="text-text-ter text-[10px] uppercase tracking-wider font-semibold mb-2">
          Redes
        </p>
        <a
          href="https://www.instagram.com/ladrandoideas"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-2 text-sm text-text-sec hover:text-primary transition-colors"
        >
          <InstagramIcon />
          @ladrandoideas
        </a>
      </div>

      {/* Recent episodes */}
      {recentEpisodes.length > 0 && (
        <div>
          <p className="text-text-ter text-[10px] uppercase tracking-wider font-semibold mb-2">
            Episodios recientes
          </p>
          <div className="space-y-2">
            {recentEpisodes.map((ep) => (
              <a
                key={ep.id}
                href={
                  ep.share_token === currentToken
                    ? "#"
                    : `/guion/${ep.share_token}`
                }
                className={`block rounded-lg p-2.5 text-xs transition-colors ${
                  ep.share_token === currentToken
                    ? "bg-primary-subtle border border-primary-border"
                    : "bg-bg border border-border hover:border-primary-border"
                }`}
              >
                <span className="text-text-ter">
                  {ep.season_number ? `T${ep.season_number} · ` : ""}
                  {ep.episode_number ? `Ep. ${ep.episode_number}` : ""}
                </span>
                <p className="text-text-pri font-medium truncate mt-0.5">
                  {ep.guest_name}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SpotifyIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function ApplePodcastsIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59-.292 1.002-.818 1.002-.42 0-.742-.27-.85-.748-.272-1.194-.87-2.434-1.79-3.378-1.344-1.404-3.053-2.16-4.862-2.16-1.809 0-3.518.756-4.862 2.16-.921.944-1.518 2.184-1.79 3.378-.108.478-.43.748-.85.748-.526 0-.937-.413-.818-1.002.352-1.773 1.04-3.12 2.264-4.392 1.608-1.685 3.72-2.587 6.056-2.587zM11.865 15.8c-.618 0-1.09.542-1.476 1.218-.402.706-.662 1.672-.662 2.727 0 1.425.754 2.073 2.138 2.073s2.138-.648 2.138-2.073c0-1.055-.26-2.02-.662-2.727-.386-.676-.858-1.218-1.476-1.218zm0-2.013c1.208 0 2.188.478 2.916 1.378.544.672.91 1.49 1.134 2.39.336 1.352.025 2.986-.914 3.86-.538.5-1.258.767-2.044.767h-2.184c-.786 0-1.506-.266-2.044-.768-.939-.873-1.25-2.507-.914-3.86.223-.899.59-1.717 1.134-2.389.728-.9 1.708-1.378 2.916-1.378zm0-5.154c1.46 0 2.722.552 3.684 1.554.876.912 1.38 2.04 1.596 3.342.072.432-.21.816-.66.816-.348 0-.654-.234-.72-.636-.144-.93-.516-1.74-1.14-2.388-.756-.792-1.686-1.206-2.76-1.206s-2.004.414-2.76 1.206c-.624.648-.996 1.458-1.14 2.388-.066.402-.372.636-.72.636-.45 0-.732-.384-.66-.816.216-1.302.72-2.43 1.596-3.342.962-1.002 2.224-1.554 3.684-1.554z" />
    </svg>
  );
}

function AmazonMusicIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.045 18.02c.07-.116.157-.228.185-.301.015-.04.035-.04.07-.012 2.225 1.72 4.728 2.88 7.543 3.376a15.149 15.149 0 006.17-.065 14.425 14.425 0 006.27-3.13c.13-.107.19-.12.27.007.48.68.95 1.37 1.44 2.05.07.1.06.16-.04.24a17.661 17.661 0 01-7.47 3.76 17.08 17.08 0 01-6.48.31 17.357 17.357 0 01-7.37-2.92c-.2-.15-.39-.32-.58-.49zM12 2a10 10 0 100 20 10 10 0 000-20zm-1.5 14.5v-9l7 4.5-7 4.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
