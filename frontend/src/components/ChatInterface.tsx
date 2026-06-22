"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage, evaluateResponse, ChatMessage } from "@/lib/api";
import SourceCitation from "./SourceCitation";

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [evalResults, setEvalResults] = useState<
    { index: number; passed: boolean; details: string }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendChatMessage(input);
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: result.answer,
        sources: result.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao conectar com o servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (index: number) => {
    const msg = messages[index];
    if (msg.role !== "assistant" || !msg.sources) return;

    const prevUserMsg = messages.slice(0, index).reverse().find((m) => m.role === "user");
    if (!prevUserMsg) return;

    try {
      const result = await evaluateResponse(
        prevUserMsg.content,
        msg.content,
        msg.sources.map((s) => s.content)
      );
      setEvalResults((prev) => [
        ...prev,
        { index, passed: result.passed, details: result.details },
      ]);
    } catch {
      console.error("Evaluation failed");
    }
  };

  return (
    <div className="flex flex-col h-[560px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <p className="text-[15px] text-[#86868b] font-medium">Pergunte sobre seus documentos</p>
            <p className="text-[13px] text-[#aeaeb2] mt-1">O sistema vai buscar nas fontes indexadas</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-[18px] px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#0071e3] text-white rounded-br-[4px]"
                  : "bg-[#f5f5f7] text-[#1d1d1f] rounded-bl-[4px]"
              }`}
            >
              <p className="text-[15px] leading-[1.45] whitespace-pre-wrap">{msg.content}</p>

              {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#e5e5e7]">
                  <SourceCitation sources={msg.sources} />
                  <button
                    onClick={() => handleEvaluate(i)}
                    className="mt-2.5 text-[12px] text-[#0071e3] hover:text-[#0077ed] font-medium transition-colors"
                  >
                    Avaliar com Ragas
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f5f5f7] rounded-[18px] rounded-bl-[4px] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#aeaeb2] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#aeaeb2] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#aeaeb2] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[13px] text-[#86868b]">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Eval Results */}
      {evalResults.map((r) => (
        <div
          key={r.index}
          className={`mx-5 mb-3 px-4 py-3 rounded-[12px] text-[13px] ${
            r.passed
              ? "bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]"
              : "bg-[#fff3e0] text-[#e65100] border border-[#ffe0b2]"
          }`}
        >
          <div className="flex items-center gap-2 font-medium mb-1">
            {r.passed ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            Avaliação: {r.passed ? "Aprovado" : "Atenção"}
          </div>
          <pre className="whitespace-pre-wrap text-[12px] opacity-80">{r.details}</pre>
        </div>
      ))}

      {/* Input Area */}
      <div className="px-5 py-4 border-t border-[#e5e5e7] bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua pergunta..."
            className="flex-1 bg-[#f5f5f7] text-[#1d1d1f] rounded-[12px] px-4 py-2.5 text-[15px] placeholder:text-[#aeaeb2] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:bg-white transition-all border border-transparent focus:border-[#0071e3]/20"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#0071e3] text-white px-5 py-2.5 rounded-[12px] text-[15px] font-medium hover:bg-[#0077ed] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
