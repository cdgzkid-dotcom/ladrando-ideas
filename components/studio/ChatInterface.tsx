"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface({
  onScriptReady,
}: {
  onScriptReady: (content: string, messages: Message[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send initial message on mount
  useEffect(() => {
    sendToAPI([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendToAPI(currentMessages: Message[]) {
    setIsStreaming(true);
    let assistantText = "";

    // Add placeholder assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      }
    } catch {
      assistantText = "Error conectando con la IA. Intenta de nuevo.";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: assistantText,
        };
        return updated;
      });
    }

    setIsStreaming(false);

    // Check if the response contains a script (has markdown headers like ## BLOQUE)
    if (
      assistantText.includes("## BLOQUE") ||
      assistantText.includes("## CIERRE")
    ) {
      const allMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: assistantText },
      ];
      onScriptReady(assistantText, allMessages);
    }
  }

  function handleSend() {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    sendToAPI(newMessages);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary-subtle text-text-pri rounded-br-md"
                  : "bg-bg-card text-text-pri border border-border rounded-bl-md"
              }`}
            >
              {msg.content || (
                <span className="inline-flex gap-1 animate-pulse-soft">
                  <span className="w-1.5 h-1.5 bg-text-sec rounded-full" />
                  <span className="w-1.5 h-1.5 bg-text-sec rounded-full" />
                  <span className="w-1.5 h-1.5 bg-text-sec rounded-full" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu respuesta..."
            rows={1}
            className="flex-1 bg-bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-pri placeholder:text-text-ter resize-none focus:outline-none focus:border-primary-border transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-40 hover:brightness-110 transition-all shrink-0"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
