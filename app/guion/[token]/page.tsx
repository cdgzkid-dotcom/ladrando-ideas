"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import GuestScriptView from "@/components/guest/GuestScriptView";
import type { Script, Comment } from "@/lib/supabase";

export default function GuestGuionPage() {
  const params = useParams();
  const token = params.token as string;

  const [script, setScript] = useState<(Script & { comments: Comment[]; recentEpisodes?: Script[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/guion/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setScript(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-primary mb-2">
            LADRANDO IDEAS
          </h1>
          <p className="text-text-sec text-sm">
            Este guion no existe o el link ya no es valido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GuestScriptView
      script={script}
      initialComments={script.comments || []}
      recentEpisodes={script.recentEpisodes || []}
    />
  );
}
