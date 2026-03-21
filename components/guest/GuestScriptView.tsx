"use client";

import { useState, useCallback } from "react";
import BlockCard from "./BlockCard";
import ApproveButton from "./ApproveButton";
import Sidebar from "./Sidebar";
import type { Script, Comment } from "@/lib/supabase";

function splitIntoBlocks(content: string): { section: string; content: string }[] {
  const parts = content.split(/(?=^## )/m);
  const blocks: { section: string; content: string }[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (!trimmed.startsWith("## ")) continue;

    const headerMatch = trimmed.match(/^## (.+?)(?:\n|$)/);
    const section = headerMatch ? headerMatch[1].trim() : "Bloque";

    blocks.push({ section, content: trimmed });
  }

  return blocks;
}

export default function GuestScriptView({
  script,
  initialComments,
}: {
  script: Script;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [status, setStatus] = useState(script.status);

  const content = script.content;
  const blocks = splitIntoBlocks(content);

  const introMatch = content.match(/^([\s\S]*?)(?=^## )/m);
  const introContent = introMatch ? introMatch[1].trim() : "";

  const refreshComments = useCallback(async () => {
    const res = await fetch(`/api/comments/${script.id}`);
    const data = await res.json();
    if (Array.isArray(data)) setComments(data);
  }, [script.id]);

  function getCommentsForSection(section: string) {
    return comments.filter((c) => c.section === section);
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-primary-subtle border border-primary-border rounded-xl p-5">
            <p className="text-sm text-text-pri leading-relaxed">
              Hola <strong>{script.guest_name}</strong>, aqui esta el guion que
              preparamos para tu episodio en Ladrando Ideas. Leelo con calma — es
              una guia de la conversacion, no un script exacto. Si algo no te
              convence, quieres agregar o quitar algo, deja un comentario en la
              seccion que quieras.
            </p>
          </div>

          {introContent && (
            <BlockCard
              section="Introduccion"
              content={introContent}
              scriptId={script.id}
              comments={getCommentsForSection("Introduccion")}
              onCommentAdded={refreshComments}
            />
          )}

          {blocks.map((block, i) => (
            <BlockCard
              key={i}
              section={block.section}
              content={block.content}
              scriptId={script.id}
              comments={getCommentsForSection(block.section)}
              onCommentAdded={refreshComments}
            />
          ))}

          {status !== "recorded" && (
            <ApproveButton
              scriptId={script.id}
              currentStatus={status}
              onApproved={() => setStatus("approved")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
