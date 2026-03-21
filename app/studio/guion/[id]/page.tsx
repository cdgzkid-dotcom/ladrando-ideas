"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import ScriptViewer from "@/components/studio/ScriptViewer";
import ScriptEditor from "@/components/studio/ScriptEditor";
import type { Script, Comment } from "@/lib/supabase";

const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "shared", label: "Compartido" },
  { value: "approved", label: "Aprobado" },
  { value: "recorded", label: "Grabado" },
];

export default function ViewScriptPage() {
  const params = useParams();
  const id = params.id as string;

  const [script, setScript] = useState<(Script & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchScript = useCallback(async () => {
    const res = await fetch(`/api/scripts/${id}`);
    const data = await res.json();
    setScript(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchScript();
  }, [fetchScript]);

  async function updateStatus(newStatus: string) {
    await fetch(`/api/scripts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchScript();
  }

  async function saveContent(newContent: string) {
    await fetch(`/api/scripts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });
    setEditing(false);
    fetchScript();
  }

  function copyLink() {
    if (!script) return;
    const url = `${window.location.origin}/guion/${script.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!script) {
    return <p className="text-text-sec text-center py-20">Guion no encontrado</p>;
  }

  return (
    <div>
      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-text-pri">
            {script.guest_name}
          </h1>
          <p className="text-text-sec text-sm">
            {script.guest_profile || "Sin perfil"}
            {script.episode_number
              ? ` — Ep. ${script.episode_number}`
              : ""}
            {script.season_number ? ` · T${script.season_number}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={script.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-pri focus:outline-none focus:border-primary-border"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setEditing(!editing)}
            className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs font-medium text-text-pri hover:border-primary-border transition-colors"
          >
            {editing ? "Cancelar" : "Editar"}
          </button>

          <button
            onClick={copyLink}
            className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
          >
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </div>
      </div>

      {/* Script */}
      <div className="max-w-3xl">
        {editing ? (
          <ScriptEditor content={script.content} onSave={saveContent} />
        ) : (
          <ScriptViewer content={script.content} />
        )}
      </div>

      {/* Comments */}
      {script.comments && script.comments.length > 0 && (
        <div className="max-w-3xl mt-8">
          <h2 className="font-display text-lg font-bold text-text-pri mb-4">
            Comentarios del invitado
          </h2>
          <div className="space-y-3">
            {script.comments.map((c: Comment) => (
              <div key={c.id} className="bg-bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary">
                    {c.author_name}
                  </span>
                  {c.section && (
                    <span className="text-xs text-text-ter">
                      en {c.section}
                    </span>
                  )}
                  <span className="text-xs text-text-ter">
                    {new Date(c.created_at).toLocaleDateString("es-MX")}
                  </span>
                </div>
                <p className="text-sm text-text-pri">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
