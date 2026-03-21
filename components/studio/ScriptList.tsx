"use client";

import { useState, useEffect } from "react";
import ScriptCard from "./ScriptCard";
import type { Script } from "@/lib/supabase";

export default function ScriptList() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scripts")
      .then((res) => res.json())
      .then((data) => {
        setScripts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-sec text-sm mb-1">No hay guiones todavia</p>
        <p className="text-text-ter text-xs">
          Crea el primero con el boton de arriba
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scripts.map((script) => (
        <ScriptCard key={script.id} script={script} />
      ))}
    </div>
  );
}
