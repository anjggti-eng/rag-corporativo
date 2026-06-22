const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export interface Source {
  content: string;
  source_file: string;
  page_number: number;
  score: number;
}

export interface EvalResult {
  faithfulness: number;
  answer_relevancy: number;
  context_precision: number;
  passed: boolean;
  details: string;
}

export async function sendChatMessage(
  question: string,
  topK: number = 3
): Promise<{ answer: string; sources: Source[] }> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, top_k: topK }),
  });

  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

export async function uploadDocuments(
  files: File[]
): Promise<{ message: string; chunks_count: number; files_processed: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_BASE}/api/ingest`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function evaluateResponse(
  question: string,
  answer: string,
  contexts: string[],
  groundTruth: string = ""
): Promise<EvalResult> {
  const res = await fetch(`${API_BASE}/api/eval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      answer,
      contexts,
      ground_truth: groundTruth,
    }),
  });

  if (!res.ok) throw new Error("Evaluation failed");
  return res.json();
}
