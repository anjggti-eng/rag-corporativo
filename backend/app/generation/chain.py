from dataclasses import dataclass, field

from loguru import logger

from app.config import settings
from app.generation.llm import LLMClient
from app.generation.prompts import SYSTEM_PROMPT, build_rag_prompt


@dataclass
class RAGResponse:
    answer: str
    sources: list[dict]
    question: str
    context_texts: list[str] = field(default_factory=list)


class RAGChain:
    def __init__(self):
        from app.retrieval.hybrid import HybridRetriever
        from app.retrieval.reranker import Reranker

        self.retriever = HybridRetriever()
        self.reranker = Reranker()
        self.llm = LLMClient()

    def query(self, question: str, top_k: int = 3) -> RAGResponse:
        logger.info(f"RAG query: {question[:80]}...")

        retrieved = self.retriever.search(
            question, top_k=settings.similarity_top_k
        )
        logger.info(f"Retrieved {len(retrieved)} documents")

        reranked = self.reranker.rerank(
            question, retrieved, top_k=top_k
        )
        logger.info(f"Reranked to {len(reranked)} documents")

        prompt = build_rag_prompt(question, reranked)
        answer = self.llm.generate(prompt, system_prompt=SYSTEM_PROMPT)

        context_texts = [doc["content"] for doc in reranked]

        return RAGResponse(
            answer=answer,
            sources=reranked,
            question=question,
            context_texts=context_texts,
        )
