from typing import Any

import chromadb
from chromadb.config import Settings as ChromaSettings
from loguru import logger

from app.config import settings


class VectorStore:
    def __init__(self):
        self._embed_model = None
        self.chroma_client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection = self.chroma_client.get_or_create_collection(
            name="corp_docs",
            metadata={"hnsw:space": "cosine"},
        )
        logger.info(
            f"VectorStore initialized | collection={self.collection.count()} docs"
        )

    @property
    def embed_model(self):
        if self._embed_model is None:
            from sentence_transformers import SentenceTransformer

            logger.info(f"Loading embedding model: {settings.embedding_model}")
            self._embed_model = SentenceTransformer(settings.embedding_model)
            logger.info("Embedding model loaded")
        return self._embed_model

    def add_documents(
        self,
        texts: list[str],
        metadatas: list[dict[str, Any]],
        ids: list[str],
    ) -> None:
        embeddings = self.embed_model.encode(texts).tolist()
        self.collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids,
        )
        logger.info(f"Added {len(texts)} documents to VectorStore")

    def search(
        self, query: str, top_k: int = 5
    ) -> list[dict[str, Any]]:
        query_embedding = self.embed_model.encode([query]).tolist()
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

        formatted = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                formatted.append(
                    {
                        "content": doc,
                        "metadata": results["metadatas"][0][i],
                        "score": 1 - results["distances"][0][i],
                        "id": results["ids"][0][i],
                    }
                )

        return formatted

    def delete_all(self) -> None:
        self.chroma_client.delete_collection("corp_docs")
        self.collection = self.chroma_client.get_or_create_collection(
            name="corp_docs",
            metadata={"hnsw:space": "cosine"},
        )
        logger.info("VectorStore cleared")

    def get_count(self) -> int:
        return self.collection.count()
