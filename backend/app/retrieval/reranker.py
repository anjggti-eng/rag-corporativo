from loguru import logger

from app.config import settings


class Reranker:
    def __init__(self):
        self._model = None

    @property
    def model(self):
        if self._model is None:
            from FlagEmbedding import FlagReranker

            logger.info(f"Loading reranker model: {settings.reranker_model}")
            self._model = FlagReranker(
                settings.reranker_model,
                use_fp16=True,
            )
            logger.info("Reranker loaded")
        return self._model

    def rerank(
        self,
        query: str,
        documents: list[dict],
        top_k: int = 3,
    ) -> list[dict]:
        if not documents:
            return []

        pairs = [[query, doc["content"]] for doc in documents]
        scores = self.model.compute_score(pairs, normalize=True)

        if isinstance(scores, float):
            scores = [scores]

        for doc, score in zip(documents, scores):
            doc["rerank_score"] = score

        reranked = sorted(documents, key=lambda x: x["rerank_score"], reverse=True)
        result = reranked[:top_k]

        logger.info(
            f"Reranked {len(documents)} docs -> {len(result)} (top score: {result[0]['rerank_score']:.4f})"
        )
        return result
