"use client";

import { useState, useRef } from "react";
import { uploadDocuments } from "@/lib/api";

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    chunks_count: number;
    files_processed: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResult(null);
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const res = await uploadDocuments(files);
      setResult(res);
      setFiles([]);
    } catch {
      setError("Falha ao fazer upload dos documentos.");
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-[#1d1d1f]">Upload de Documentos</h2>
        <p className="text-[13px] text-[#86868b] mt-1">
          PDF, DOCX, TXT ou Markdown
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[16px] p-10 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-[#0071e3] bg-[#0071e3]/[0.03]"
            : "border-[#d2d2d7] hover:border-[#0071e3]/40 hover:bg-[#f5f5f7]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
            dragActive ? "bg-[#0071e3]/10" : "bg-[#f5f5f7]"
          }`}>
            <svg className={`w-6 h-6 ${dragActive ? "text-[#0071e3]" : "text-[#86868b]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>

          {files.length > 0 ? (
            <p className="text-[15px] text-[#1d1d1f] font-medium">
              {files.length} arquivo(s) selecionado(s)
            </p>
          ) : (
            <>
              <p className="text-[15px] text-[#1d1d1f] font-medium">
                Arraste arquivos aqui ou <span className="text-[#0071e3]">procure</span>
              </p>
              <p className="text-[13px] text-[#aeaeb2] mt-1">
                Até 50MB por arquivo
              </p>
            </>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#f5f5f7] rounded-[12px] px-4 py-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#0071e3]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#0071e3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#1d1d1f] font-medium truncate">{f.name}</p>
                <p className="text-[12px] text-[#86868b]">{formatSize(f.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className="w-full mt-5 bg-[#0071e3] text-white py-3 rounded-[12px] text-[15px] font-medium hover:bg-[#0077ed] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processando...
          </span>
        ) : (
          "Enviar e Indexar"
        )}
      </button>

      {/* Success */}
      {result && (
        <div className="mt-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-[12px] p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#2e7d32] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] text-[#2e7d32] font-medium">{result.message}</p>
              <p className="text-[13px] text-[#2e7d32]/70 mt-0.5">
                {result.chunks_count} chunks criados de {result.files_processed.length} arquivo(s)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-[#fff3e0] border border-[#ffe0b2] rounded-[12px] p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#e65100] flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-[14px] text-[#e65100] font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
