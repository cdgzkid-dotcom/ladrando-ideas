"use client";

import { useState } from "react";

export default function ApproveButton({
  scriptId,
  currentStatus,
  onApproved,
}: {
  scriptId: string;
  currentStatus: string;
  onApproved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(currentStatus === "approved");

  async function handleApprove() {
    setLoading(true);
    try {
      await fetch(`/api/scripts/${scriptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      setApproved(true);
      onApproved();
    } catch {
      // silent fail
    }
    setLoading(false);
  }

  if (approved) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 bg-green-400/10 text-green-400 px-6 py-3 rounded-xl text-sm font-semibold">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guion aprobado — Christian y Kiko ya lo saben
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      <button
        onClick={handleApprove}
        disabled={loading}
        className="bg-primary text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
      >
        {loading ? "Aprobando..." : "Aprobar guion — Todo se ve bien"}
      </button>
    </div>
  );
}
