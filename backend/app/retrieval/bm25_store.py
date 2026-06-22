import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from rank_bm25 import BM25Okapi
from loguru import logger

nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("stopwords", quiet=True)


class BM25Store:
    def __init__(self):
        self.corpus: list[str] = []
        self.metadatas: list[dict] = []
        self.ids: list[str] = []
        self.bm25: BM25Okapi | None = None
        self._stop_words = set(stopwords.words("portuguese"))
        self._stop_words.update(stopwords.words("english"))

    def add_documents(
        self,
        texts: list[str],
        metadatas: list[dict],
        ids: list[str],
    ) -> None:
        self.corpus.extend(texts)
        self.metadatas.extend(metadatas)
        self.ids.extend(ids)
        self._rebuild_index()
        logger.info(f"BM25Store: added {len(texts)} docs, total={len(self.corpus)}")

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        if self.bm25 is None or len(self.corpus) == 0:
            return []

        tokenized_query = self._tokenize(query)
        scores = self.bm25.get_scores(tokenized_query)

        ranked_indices = sorted(
            range(len(scores)), key=lambda i: scores[i], reverse=True
        )[:top_k]

        results = []
        for idx in ranked_indices:
            if scores[idx] > 0:
                results.append(
                    {
                        "content": self.corpus[idx],
                        "metadata": self.metadatas[idx],
                        "score": float(scores[idx]),
                        "id": self.ids[idx],
                    }
                )

        return results

    def _tokenize(self, text: str) -> list[str]:
        tokens = word_tokenize(text.lower())
        return [t for t in tokens if t.isalnum() and t not in self._stop_words]

    def _rebuild_index(self) -> None:
        tokenized_corpus = [self._tokenize(doc) for doc in self.corpus]
        self.bm25 = BM25Okapi(tokenized_corpus)

    def clear(self) -> None:
        self.corpus = []
        self.metadatas = []
        self.ids = []
        self.bm25 = None
