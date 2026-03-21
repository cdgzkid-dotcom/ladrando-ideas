"use client";

import { useState } from "react";

export default function ScriptEditor({
  content,
  onSave,
}: {
  content: string;
  onSave: (newContent: string) => void;
}) {
  const [text, setText] = useState(content);

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[500px] bg-bg-input border border-border rounded-xl p-4 text-sm text-text-pri font-mono leading-relaxed resize-y focus:outline-none focus:border-primary-border transition-colors"
      />
      <div className="flex justify-end">
        <button
          onClick={() => onSave(text)}
          className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
