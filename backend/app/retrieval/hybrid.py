from loguru import logger

from app.retrieval.vector_store import VectorStore
from app.retrieval.bm25_store import BM25Store


class HybridRetriever:
    def __init__(self):
        self.vector_store = VectorStore()
        self.bm25_store = BM25Store()

    def add_documents(
        self,
        texts: list[str],
        metadatas: list[dict],
        ids: list[str],
    ) -> None:
        self.vector_store.add_documents(texts, metadatas, ids)
        self.bm25_store.add_documents(texts, metadatas, ids)

    def search(
        self,
        query: str,
        top_k: int = 5,
        vector_weight: float = 0.6,
        bm25_weight: float = 0.4,
    ) -> list[dict]:
        vector_results = self.vector_store.search(query, top_k=top_k * 2)
        bm25_results = self.bm25_store.search(query, top_k=top_k * 2)

        merged = self._reciprocal_rank_fusion(
            vector_results,
            bm25_results,
            vector_weight=vector_weight,
            bm25_weight=bm25_weight,
        )

        final_results = merged[:top_k]
        logger.info(
            f"Hybrid search: {len(vector_results)} vector + {len(bm25_results)} bm25 "
            f"-> {len(final_results)} final"
        )
        return final_results

    def _reciprocal_rank_fusion(
        self,
        results_a: list[dict],
        results_b: list[dict],
        vector_weight: float = 0.6,
        bm25_weight: float = 0.4,
        k: int = 60,
    ) -> list[dict]:
        scores: dict[str, float] = {}
        doc_map: dict[str, dict] = {}

        for rank, result in enumerate(results_a):
            doc_id = result["id"]
            scores[doc_id] = scores.get(doc_id, 0) + vector_weight * (1 / (k + rank + 1))
            doc_map[doc_id] = result

        for rank, result in enumerate(results_b):
            doc_id = result["id"]
            scores[doc_id] = scores.get(doc_id, 0) + bm25_weight * (1 / (k + rank + 1))
            if doc_id not in doc_map:
                doc_map[doc_id] = result

        sorted_ids = sorted(scores.keys(), key=lambda x: scores[x], reverse=True)

        fused_results = []
        for doc_id in sorted_ids:
            result = doc_map[doc_id].copy()
            result["rrf_score"] = scores[doc_id]
            fused_results.append(result)

        return fused_results

    def delete_all(self) -> None:
        self.vector_store.delete_all()
        self.bm25_store.clear()

    def get_count(self) -> int:
        return self.vector_store.get_count()
