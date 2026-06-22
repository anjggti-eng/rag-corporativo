# RAG Corporativo

Sistema RAG (Retrieval-Augmented Generation) corporativo com recuperação híbrida e avaliação integrada.

## Arquitetura

```
[Documentos] → [Extractor] → [Chunker] → [Embeddings] → [ChromaDB]
                                                                ↓
[Query] → [Vector Search] ──┐
         [BM25 Search]  ────┤→ [RRF Fusion] → [Re-ranker] → [LLM] → [Resposta + Fontes]
                                                     ↓
                                              [Ragas Eval]
```

## Stack

| Componente | Tecnologia |
|---|---|
| Backend | FastAPI + Python 3.11 |
| Ingestão | PyMuPDF, python-docx |
| Embeddings | BAAI/bge-small-en-v1.5 |
| Vector DB | ChromaDB |
| BM25 | rank_bm25 |
| Re-ranker | BAAI/bge-reranker-base |
| LLM | OpenAI GPT-4o-mini |
| Avaliação | Ragas |
| Frontend | Next.js + AI SDK |

## Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edite .env com sua OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Docker

```bash
cp backend/.env.example backend/.env
# Edite backend/.env
docker-compose up --build
```

## API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/ingest` | Upload e indexação de documentos |
| POST | `/api/chat` | Query RAG com resposta + citações |
| GET | `/api/documents` | Lista documentos indexados |
| POST | `/api/eval` | Avaliação Ragas |
| DELETE | `/api/documents` | Remove todos os documentos |

## Métricas Ragas

| Métrica | Meta | Descrição |
|---|---|---|
| Faithfulness | > 0.8 | Resposta derivada do contexto |
| Answer Relevancy | > 0.7 | Resposta pertinente à pergunta |
| Context Precision | > 0.7 | Documentos contêm a resposta |
