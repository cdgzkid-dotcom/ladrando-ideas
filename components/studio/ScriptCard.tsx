"use client";

import { useState } from "react";
import type { Script } from "@/lib/supabase";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  draft: {
    label: "Borrador",
    color: "text-text-sec",
    bg: "bg-bg-card",
  },
  shared: {
    label: "Compartido",
    color: "text-primary",
    bg: "bg-primary-subtle",
  },
  approved: {
    label: "Aprobado",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  recorded: {
    label: "Grabado",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ScriptCard({ script }: { script: Script }) {
  const [copied, setCopied] = useState(false);
  const status = statusConfig[script.status] || statusConfig.draft;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/guion/${script.share_token}`
      : "";

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 hover:border-primary-border transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-text-sec text-xs font-medium">
              {script.season_number ? `T${script.season_number} · ` : ""}
              {script.episode_number
                ? `Ep. ${script.episode_number}`
                : "Sin ep."}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <h3 className="text-text-pri font-semibold text-sm truncate">
            {script.guest_name}
          </h3>
          <p className="text-text-sec text-xs truncate">
            {script.guest_profile || "Sin perfil"}
          </p>
          <p className="text-text-ter text-xs mt-1">
            {formatDate(script.created_at)}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <a
            href={`/studio/guion/${script.id}`}
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-pri hover:border-primary-border transition-colors"
          >
            Ver
          </a>
          <button
            onClick={copyLink}
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-pri hover:border-primary-border transition-colors"
          >
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </div>
      </div>
    </div>
  );
}
