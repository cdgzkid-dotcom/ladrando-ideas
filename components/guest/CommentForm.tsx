"use client";

import { useState } from "react";

export default function CommentForm({
  scriptId,
  section,
  onCommentAdded,
}: {
  scriptId: string;
  section: string;
  onCommentAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script_id: scriptId,
          section,
          content: content.trim(),
          author_name: name.trim() || "Invitado",
        }),
      });
      setContent("");
      setName("");
      setOpen(false);
      onCommentAdded();
    } catch {
      // silent fail
    }
    setSending(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-xs text-text-ter hover:text-primary transition-colors"
      >
        + Dejar comentario
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre (opcional)"
        className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-pri placeholder:text-text-ter focus:outline-none focus:border-primary-border transition-colors"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows={3}
        className="w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm text-text-pri placeholder:text-text-ter resize-none focus:outline-none focus:border-primary-border transition-colors"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-40 hover:brightness-110 transition-all"
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-text-ter text-xs hover:text-text-sec transition-colors px-3 py-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
