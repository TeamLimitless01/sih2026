"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AIChat({ caseId }: { caseId: string }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([
    { role: "assistant", content: "Hello Investigator. I am your AI Copilot. I have full access to this case file (entities, timeline, and basic info). How can I help you analyze it today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTool]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    // Instantly show the user message and a blank assistant message that we will stream into
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setIsLoading(true);
    setActiveTool(null);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, history, userMessage })
      });

      if (!res.ok || !res.body) throw new Error("Failed to connect to AI");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "tool_start") {
              setActiveTool(data.name);
            } else if (data.type === "tool_end") {
              setActiveTool(null);
            } else if (data.type === "text") {
              assistantResponse += data.content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantResponse };
                return updated;
              });
            }
          } catch (e) {
            console.error("Failed to parse stream line:", line);
          }
        }
      }
    } catch (err) {
      toast.error("An error occurred connecting to Copilot.");
    } finally {
      setIsLoading(false);
      setActiveTool(null);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 shadow-2xl">
      <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "assistant" ? "" : "flex-row-reverse"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-blue-600" : "bg-zinc-700"}`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === "assistant" ? "bg-zinc-900 text-zinc-200" : "bg-blue-600/20 text-blue-100 border border-blue-500/30 whitespace-pre-wrap"}`}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}

                {/* Only show the loading/tool animations on the last assistant message if it's currently loading */}
                {i === messages.length - 1 && isLoading && msg.role === "assistant" && (
                  <div className="mt-1">
                    {!msg.content && !activeTool && (
                      <span className="inline-flex items-center gap-2 text-zinc-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                      </span>
                    )}
                    {activeTool && (
                      <span className="inline-flex items-center gap-2 text-blue-400 mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20 w-full">
                        <Search className="w-4 h-4 animate-pulse" /> Executing tool: <span className="font-mono text-xs">{activeTool}</span>...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about the case..."
          className="bg-zinc-900 border-zinc-800 text-zinc-200"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
