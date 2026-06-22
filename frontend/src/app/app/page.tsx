"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import DocumentUpload from "@/components/DocumentUpload";
import Link from "next/link";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "upload">("chat");

  return (
    <main className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-[8px] bg-white border border-[#e5e5e7] flex items-center justify-center hover:bg-[#f5f5f7] transition-colors">
              <svg className="w-4 h-4 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                RAG Corporativo
              </h1>
              <p className="text-[13px] text-[#86868b]">
                Recuperação híbrida com avaliação integrada
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] font-medium transition-colors"
          >
            Landing Page
          </Link>
        </div>

        {/* Tab Segmented Control */}
        <div className="flex bg-[#e8e8ed] rounded-[10px] p-[3px] mb-6 w-fit">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-5 py-[7px] rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-white text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-5 py-[7px] rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
              activeTab === "upload"
                ? "bg-white text-[#1d1d1f] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Documentos
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#e5e5e7] overflow-hidden">
          {activeTab === "chat" ? <ChatInterface /> : <DocumentUpload />}
        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#aeaeb2] mt-5">
          Powered by GPT-4o-mini · ChromaDB · Ragas
        </p>
      </div>
    </main>
  );
}
