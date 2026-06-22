from pathlib import Path

from loguru import logger

from app.config import settings
from app.ingestion.extractor import DocumentExtractor
from app.ingestion.chunker import SemanticChunker, Chunk


class IngestionPipeline:
    def __init__(self):
        self.extractor = DocumentExtractor()
        self.chunker = SemanticChunker(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
        )

    def ingest_file(self, file_path: str) -> list[Chunk]:
        logger.info(f"Ingesting file: {file_path}")
        pages = self.extractor.extract(file_path)
        logger.info(f"Extracted {len(pages)} pages from {file_path}")

        chunks = self.chunker.chunk_pages(pages)
        logger.info(f"Created {len(chunks)} chunks from {file_path}")

        return chunks

    def ingest_directory(self, dir_path: str) -> list[Chunk]:
        all_chunks = []
        path = Path(dir_path)

        for file_path in path.iterdir():
            if file_path.is_file():
                if file_path.suffix.lower() in DocumentExtractor.SUPPORTED_EXTENSIONS:
                    try:
                        chunks = self.ingest_file(str(file_path))
                        all_chunks.extend(chunks)
                    except Exception as e:
                        logger.error(f"Failed to ingest {file_path}: {e}")

        logger.info(f"Total chunks from directory: {len(all_chunks)}")
        return all_chunks

    def chunks_to_documents(self, chunks: list[Chunk]):
        from llama_index.core import Document

        documents = []
        for chunk in chunks:
            doc = Document(
                text=chunk.content,
                metadata={
                    "source_file": chunk.source_file,
                    "page_number": chunk.page_number,
                    "section_title": chunk.section_title,
                    "chunk_index": chunk.chunk_index,
                },
            )
            documents.append(doc)

        return documents
