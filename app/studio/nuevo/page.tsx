"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/studio/ChatInterface";
import ScriptViewer from "@/components/studio/ScriptViewer";
import ScriptEditor from "@/components/studio/ScriptEditor";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function NuevoGuionPage() {
  const router = useRouter();
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function handleScriptReady(content: string, _messages: Message[]) {
    setScriptContent(content);
  }

  async function saveScript() {
    if (!scriptContent) return;
    setSaving(true);

    // Try to extract metadata from the script content
    const titleMatch = scriptContent.match(/^# (.+?)(?:\n|$)/m);
    const guestMatch = scriptContent.match(/\*\*Invitado:\*\*\s*(.+?)(?:\s*—|$)/m);
    const profileMatch = scriptContent.match(/\*\*Invitado:\*\*\s*.+?—\s*(.+?)(?:\n|$)/m);

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
    <div className="flex flex-col" style={{ height: "calc(100vh - 57px)" }}>
      {!scriptContent ? (
        <ChatInterface onScriptReady={handleScriptReady} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
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
                  {copied
                    ? "Link copiado"
                    : "Compartir con invitado"}
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
                Guion guardado — ya puedes mandarle el link al invitado por
                WhatsApp
              </p>
            </div>
          )}

          {/* Script content */}
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
