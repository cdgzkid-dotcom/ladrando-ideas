"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/studio/ChatInterface";
import ScriptViewer from "@/components/studio/ScriptViewer";
import ScriptEditor from "@/components/studio/ScriptEditor";

export default function NuevoGuionPage() {
  const router = useRouter();
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const scriptRef = useRef<HTMLDivElement>(null);

  // Scroll to script when it appears
  useEffect(() => {
    if (scriptContent && scriptRef.current) {
      scriptRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scriptContent]);

  function handleScriptGenerated(content: string) {
    setScriptContent(content);
    setSaved(false);
    setShareToken(null);
  }

  async function saveScript() {
    if (!scriptContent) return;
    setSaving(true);

    const titleMatch = scriptContent.match(/^# (.+?)(?:\n|$)/m);
    const guestMatch = scriptContent.match(/\*\*Invitado:\*\*\s*(.+?)(?:\s*—|$)/m);
    const profileMatch = scriptContent.match(/\*\*Invitado:\*\*\s*.+?—\s*(.+?)(?:\n|$)/m);

    // Extract season/episode from "**Episodio:** T4 · Ep. 2" or "T4 E02" patterns
    const epLineMatch = scriptContent.match(/\*\*Episodio:\*\*\s*T(\d+)\s*[·.]\s*Ep\.?\s*(\d+)/i);
    const epFallback = scriptContent.match(/T(\d+)\s*E(\d+)/i);
    const seasonNum = epLineMatch ? parseInt(epLineMatch[1]) : epFallback ? parseInt(epFallback[1]) : null;
    const episodeNum = epLineMatch ? parseInt(epLineMatch[2]) : epFallback ? parseInt(epFallback[2]) : null;

    const title = titleMatch ? titleMatch[1].trim() : "Guion sin titulo";
    const guestName = guestMatch ? guestMatch[1].trim() : "Invitado";
    const guestProfile = profileMatch ? profileMatch[1].trim() : null;

    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          guest_name: guestName,
          guest_profile: guestProfile,
          episode_number: episodeNum,
          season_number: seasonNum,
          content: scriptContent,
        }),
      });

      const data = await res.json();
      setShareToken(data.share_token);
      setSaved(true);
    } catch {
      // handle error
    }

    setSaving(false);
  }

  function copyShareLink() {
    if (!shareToken) return;
    const url = `${window.location.origin}/guion/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 57px)" }}>
      {/* Chat — always visible */}
      <div style={{ height: scriptContent ? "40vh" : "calc(100vh - 57px)", minHeight: 300 }}
        className="flex flex-col border-b border-border transition-all"
      >
        <ChatInterface onScriptGenerated={handleScriptGenerated} />
      </div>

      {/* Script — appears below chat when generated */}
      {scriptContent && (
        <div ref={scriptRef} className="flex-1 p-4 overflow-y-auto">
          {/* Action bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            {!saved ? (
              <>
                <button
                  onClick={saveScript}
                  disabled={saving}
                  className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar guion"}
                </button>
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-bg-card border border-border px-5 py-2.5 rounded-lg text-sm font-medium text-text-pri hover:border-primary-border transition-colors"
                >
                  {editing ? "Ver preview" : "Editar"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={copyShareLink}
                  className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
                >
                  {copied ? "Link copiado" : "Compartir con invitado"}
                </button>
                <button
                  onClick={() => router.push("/studio")}
                  className="bg-bg-card border border-border px-5 py-2.5 rounded-lg text-sm font-medium text-text-pri hover:border-primary-border transition-colors"
                >
                  Ir al dashboard
                </button>
              </>
            )}
          </div>

          {saved && (
            <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 mb-6">
              <p className="text-green-400 text-sm">
                Guion guardado — ya puedes mandarle el link al invitado por WhatsApp
              </p>
            </div>
          )}

          <div className="max-w-3xl">
            {editing ? (
              <ScriptEditor
                content={scriptContent}
                onSave={(newContent) => {
                  setScriptContent(newContent);
                  setEditing(false);
                }}
              />
            ) : (
              <ScriptViewer content={scriptContent} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
