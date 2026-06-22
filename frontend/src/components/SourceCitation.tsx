import { Source } from "@/lib/api";

interface SourceCitationProps {
  sources: Source[];
}

export default function SourceCitation({ sources }: SourceCitationProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-[#86868b] font-medium uppercase tracking-wider">Fontes</p>
      {sources.map((source, i) => (
        <div
          key={i}
          className="bg-white rounded-[10px] px-3 py-2.5 border border-[#e5e5e7]"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0071e3]/10 text-[10px] font-semibold text-[#0071e3]">
              {i + 1}
            </span>
            <span className="text-[13px] text-[#1d1d1f] font-medium truncate flex-1">
              {source.source_file}
            </span>
            <span className="text-[12px] text-[#86868b]">
              p. {source.page_number}
            </span>
          </div>
          <p className="text-[12px] text-[#86868b] leading-relaxed line-clamp-2 pl-7">
            {source.content}
          </p>
          <div className="flex items-center justify-end mt-1.5 pr-1">
            <span className="text-[11px] text-[#aeaeb2] font-medium">
              {(source.score * 100).toFixed(0)}% relevance
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
