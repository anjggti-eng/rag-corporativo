import uuid
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from loguru import logger

from app.config import settings
from app.ingestion.pipeline import IngestionPipeline

app = FastAPI(
    title="RAG Corporativo",
    description="Sistema RAG robusto com recuperação híbrida e avaliação",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ingestion_pipeline = IngestionPipeline()
rag_chain = None
evaluator = None


def get_rag_chain():
    global rag_chain
    if rag_chain is None:
        from app.generation.chain import RAGChain

        rag_chain = RAGChain()
    return rag_chain


def get_evaluator():
    global evaluator
    if evaluator is None:
        from app.evaluation.ragas_eval import RAGASEvaluator

        evaluator = RAGASEvaluator()
    return evaluator


@app.on_event("startup")
async def startup():
    logger.info("RAG Corporativo server starting...")


class ChatRequest(BaseModel):
    question: str
    top_k: int = 3


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict]
    question: str


class EvalRequest(BaseModel):
    question: str
    answer: str
    contexts: list[str]
    ground_truth: str = ""


class EvalResponse(BaseModel):
    faithfulness: float
    answer_relevancy: float
    context_precision: float
    passed: bool
    details: str


class IngestResponse(BaseModel):
    message: str
    chunks_count: int
    files_processed: list[str]


@app.get("/health")
async def health():
    chain = get_rag_chain()
    try:
        count = chain.retriever.get_count()
    except Exception:
        count = 0
    return {
        "status": "ok",
        "documents_indexed": count,
    }


@app.post("/api/ingest", response_model=IngestResponse)
async def ingest_documents(files: list[UploadFile] = File(...)):
    try:
        chain = get_rag_chain()
        saved_files = []
        for file in files:
            file_path = Path(settings.data_dir) / file.filename
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            saved_files.append(str(file_path))

        total_chunks = 0
        for file_path in saved_files:
            chunks = ingestion_pipeline.ingest_file(file_path)
            documents = ingestion_pipeline.chunks_to_documents(chunks)

            texts = [doc.text for doc in documents]
            metadatas = [doc.metadata for doc in documents]
            ids = [str(uuid.uuid4()) for _ in documents]

            chain.retriever.add_documents(texts, metadatas, ids)
            total_chunks += len(chunks)

        return IngestResponse(
            message=f"Successfully ingested {len(files)} files",
            chunks_count=total_chunks,
            files_processed=[Path(f).name for f in saved_files],
        )
    except Exception as e:
        logger.error(f"Ingestion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        chain = get_rag_chain()
        response = chain.query(request.question, top_k=request.top_k)
        return ChatResponse(
            answer=response.answer,
            sources=[
                {
                    "content": s["content"][:200] + "..." if len(s["content"]) > 200 else s["content"],
                    "source_file": s["metadata"].get("source_file", ""),
                    "page_number": s["metadata"].get("page_number", 0),
                    "score": s.get("rerank_score", s.get("score", 0)),
                }
                for s in response.sources
            ],
            question=response.question,
        )
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/eval", response_model=EvalResponse)
async def evaluate_response(request: EvalRequest):
    try:
        ev = get_evaluator()
        result = ev.evaluate(
            question=request.question,
            answer=request.answer,
            contexts=request.contexts,
            ground_truth=request.ground_truth,
        )
        return EvalResponse(
            faithfulness=result.faithfulness,
            answer_relevancy=result.answer_relevancy,
            context_precision=result.context_precision,
            passed=result.passed,
            details=result.details,
        )
    except Exception as e:
        logger.error(f"Evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/documents")
async def list_documents():
    chain = get_rag_chain()
    count = chain.retriever.get_count()
    return {"total_chunks": count, "status": "ok"}


@app.delete("/api/documents")
async def clear_documents():
    try:
        chain = get_rag_chain()
        chain.retriever.delete_all()
        return {"message": "All documents cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
