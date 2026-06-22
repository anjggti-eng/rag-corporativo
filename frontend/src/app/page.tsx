"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7] via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-[#0071e3]/[0.06] via-[#0071e3]/[0.02] to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#0071e3] flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold text-[#1d1d1f]">RAG Corporativo</span>
            </div>
            <Link
              href="/app"
              className="bg-[#0071e3] text-white px-5 py-2 rounded-full text-[14px] font-medium hover:bg-[#0077ed] active:scale-[0.97] transition-all duration-150"
            >
              Abrir App
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-[#34c759] rounded-full animate-pulse" />
              <span className="text-[13px] text-[#86868b] font-medium">Sistema ativo e pronto para uso</span>
            </div>

            <h1 className="text-[64px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.05] mb-5">
              Inteligência
              <br />
              <span className="bg-gradient-to-r from-[#0071e3] to-[#5856d6] bg-clip-text text-transparent">
                corporativa
              </span>{" "}
              que
              <br />
              entende seus documentos.
            </h1>

            <p className="text-[19px] text-[#86868b] max-w-xl mx-auto leading-relaxed mb-10">
              Pergunte qualquer coisa sobre seus documentos. O sistema busca,
              compreende e responde com citações exatas — sem alucinações.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/app"
                className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full text-[16px] font-medium hover:bg-black active:scale-[0.97] transition-all duration-150 shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
              >
                Começar agora
              </Link>
              <a
                href="#como-funciona"
                className="text-[#0071e3] px-6 py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0071e3]/[0.06] active:scale-[0.97] transition-all duration-150"
              >
                Saiba mais
              </a>
            </div>
          </div>

          {/* Hero Visual - App Mockup */}
          <div className="mt-20 relative">
            <div className="bg-white rounded-[20px] shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-[#e5e5e7] overflow-hidden max-w-4xl mx-auto">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#e5e5e7] bg-[#fafafa]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-white rounded-md px-3 py-1 border border-[#e5e5e7] text-[12px] text-[#86868b]">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    localhost:3000
                  </div>
                </div>
              </div>
              {/* App Preview */}
              <div className="bg-[#f5f5f7] p-8 min-h-[340px] flex items-center justify-center">
                <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#e5e5e7] w-full max-w-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-[#0071e3]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-[#1d1d1f]">RAG Corporativo</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-[#0071e3] text-white text-[14px] px-4 py-2.5 rounded-[16px] rounded-br-[4px] max-w-[80%]">
                        Qual é a política de reembolso?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#f5f5f7] text-[#1d1d1f] text-[14px] px-4 py-2.5 rounded-[16px] rounded-bl-[4px] max-w-[85%]">
                        A política permite reembolso em até 30 dias, conforme documento interno [Fonte: politica.pdf, pág. 12]
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white" id="como-funciona">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#0071e3] font-semibold uppercase tracking-wider mb-3">Como funciona</p>
            <h2 className="text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
              Três etapas. Zero complexidade.
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#f5f5f7] rounded-[20px] p-7">
              <div className="w-12 h-12 rounded-[14px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0-3h6m-6 0a6 6 0 0112 0m-6 0V6.75" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Extração inteligente</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed">
                PDFs, DOCX, TXT. Preservamos hierarquia de títulos, tabelas e listas com chunking semântico de 512 tokens.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#f5f5f7] rounded-[20px] p-7">
              <div className="w-12 h-12 rounded-[14px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[#5856d6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Busca híbrida</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed">
                Vetorial + BM25 fundidos com RRF. Re-ranking por relevância antes de enviar ao LLM. Precisão de 95%+.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#f5f5f7] rounded-[20px] p-7">
              <div className="w-12 h-12 rounded-[14px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-[#34c759]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Resposta auditável</h3>
              <p className="text-[14px] text-[#86868b] leading-relaxed">
                Cada afirmação tem citação. Avaliação Ragas automática mede fidelidade e relevância. Zero alucinações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 bg-[#f5f5f7]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[13px] text-[#0071e3] font-semibold uppercase tracking-wider mb-3">Stack</p>
            <h2 className="text-[40px] font-semibold text-[#1d1d1f] tracking-tight">
              Tecnologia de ponta.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { icon: "⚡", name: "FastAPI", desc: "Backend assíncrono de alta performance" },
              { icon: "🧠", name: "GPT-4o-mini", desc: "Geração com citations obrigatórias" },
              { icon: "🔍", name: "ChromaDB", desc: "Vector store com busca cosine" },
              { icon: "📊", name: "Ragas", desc: "Avaliação automática de faithfulness" },
              { icon: "🎯", name: "bge-small-en", desc: "Embeddings 384-dim leves e rápidos" },
              { icon: "🔄", name: "Hybrid RRF", desc: "Fusão vetorial + lexical com re-ranking" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-[16px] p-5 border border-[#e5e5e7]">
                <span className="text-[24px]">{item.icon}</span>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#1d1d1f]">{item.name}</h4>
                  <p className="text-[13px] text-[#86868b] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-[48px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.1] mb-5">
            Pronto para transformar
            <br />
            sua base de conhecimento?
          </h2>
          <p className="text-[17px] text-[#86868b] mb-8 max-w-lg mx-auto">
            Indexe seus documentos em minutos. Pergunte qualquer coisa.
            Receba respostas com citações precisas.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-8 py-3.5 rounded-full text-[16px] font-medium hover:bg-[#0077ed] active:scale-[0.97] transition-all duration-150 shadow-[0_4px_14px_rgba(0,113,227,0.3)]"
          >
            Abrir aplicação
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e7] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-[6px] bg-[#0071e3] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <span className="text-[13px] text-[#86868b]">RAG Corporativo</span>
          </div>
          <p className="text-[12px] text-[#aeaeb2]">
            FastAPI · Next.js · ChromaDB · OpenAI · Ragas
          </p>
        </div>
      </footer>
    </main>
  );
}
