from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    openai_api_key: str = ""
    chroma_persist_dir: str = "./chroma_db"
    data_dir: str = "./data"
    embedding_model: str = "BAAI/bge-small-en-v1.5"
    reranker_model: str = "BAAI/bge-reranker-base"
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0.0
    chunk_size: int = 512
    chunk_overlap: int = 50
    similarity_top_k: int = 5
    rerank_top_k: int = 3

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

Path(settings.chroma_persist_dir).mkdir(parents=True, exist_ok=True)
Path(settings.data_dir).mkdir(parents=True, exist_ok=True)
