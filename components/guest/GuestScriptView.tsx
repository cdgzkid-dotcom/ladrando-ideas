"use client";

import { useState, useCallback } from "react";
import BlockCard from "./BlockCard";
import ApproveButton from "./ApproveButton";
import Sidebar from "./Sidebar";
import type { Script, Comment } from "@/lib/supabase";

type RecentEpisode = Pick<
  Script,
  "id" | "title" | "guest_name" | "episode_number" | "season_number" | "status" | "share_token"
>;

function splitIntoBlocks(content: string): { section: string; content: string }[] {
  const parts = content.split(/(?=^## )/m);
  const blocks: { section: string; content: string }[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^## (.+?)(?:\n|$)/);
    const section = headerMatch ? headerMatch[1].trim() : "Introduccion";

    blocks.push({ section, content: trimmed });
  }

  if (blocks.length === 0) {
    return [{ section: "Guion", content }];
  }

  return blocks;
}

export default function GuestScriptView({
  script,
  initialComments,
  recentEpisodes = [],
}: {
  script: Script;
  initialComments: Comment[];
  recentEpisodes?: RecentEpisode[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [status, setStatus] = useState(script.status);

  const blocks = splitIntoBlocks(script.content);

  const introMatch = script.content.match(/^([\s\S]*?)(?=^## )/m);
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
      {/* Sidebar */}
      <Sidebar
        recentEpisodes={recentEpisodes}
        currentToken={script.share_token}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="border-b border-border bg-bg-alt lg:hidden">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
            <span className="font-display text-lg font-bold text-primary tracking-tight">
              LADRANDO IDEAS
            </span>
            <span className="text-text-ter text-sm">
              Guion
              {script.episode_number
                ? ` — Episodio ${script.episode_number}`
                : ""}
            </span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Welcome message */}
          <div className="bg-primary-subtle border border-primary-border rounded-xl p-5">
            <p className="text-sm text-text-pri leading-relaxed">
              Hola <strong>{script.guest_name}</strong>, aqui esta el guion que
              preparamos para tu episodio en Ladrando Ideas. Leelo con calma — es
              una guia de la conversacion, no un script exacto. Si algo no te
              convence, quieres agregar o quitar algo, deja un comentario en la
              seccion que quieras.
            </p>
          </div>

          {/* Intro content (before blocks) */}
          {introContent && (
            <div className="bg-bg-card border border-border rounded-xl p-5 sm:p-6">
              <div className="prose-script text-text-pri">
                <div
                  dangerouslySetInnerHTML={{
                    __html: introContent
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            </div>
          )}

          {/* Blocks */}
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

          {/* Approve button */}
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
