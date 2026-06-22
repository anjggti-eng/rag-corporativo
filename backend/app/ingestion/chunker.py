from dataclasses import dataclass

from app.ingestion.extractor import ExtractedPage


@dataclass
class Chunk:
    content: str
    chunk_index: int
    source_file: str
    page_number: int
    section_title: str
    start_char: int
    end_char: int


class SemanticChunker:
    def __init__(self, chunk_size: int = 512, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_pages(self, pages: list[ExtractedPage]) -> list[Chunk]:
        all_chunks = []
        global_index = 0

        for page in pages:
            page_chunks = self._chunk_single_page(page, global_index)
            all_chunks.extend(page_chunks)
            global_index += len(page_chunks)

        return all_chunks

    def _chunk_single_page(
        self, page: ExtractedPage, start_index: int
    ) -> list[Chunk]:
        text = page.content
        if len(text) <= self.chunk_size:
            return [
                Chunk(
                    content=text,
                    chunk_index=start_index,
                    source_file=page.source_file,
                    page_number=page.page_number,
                    section_title=page.section_title,
                    start_char=0,
                    end_char=len(text),
                )
            ]

        chunks = []
        sentences = self._split_sentences(text)
        current_chunk = ""
        chunk_start = 0
        char_position = 0

        for sentence in sentences:
            if len(current_chunk) + len(sentence) > self.chunk_size and current_chunk:
                chunks.append(
                    Chunk(
                        content=current_chunk.strip(),
                        chunk_index=start_index + len(chunks),
                        source_file=page.source_file,
                        page_number=page.page_number,
                        section_title=page.section_title,
                        start_char=chunk_start,
                        end_char=chunk_start + len(current_chunk),
                    )
                )
                overlap_text = current_chunk[-self.chunk_overlap :]
                chunk_start = char_position - len(overlap_text)
                current_chunk = overlap_text + " " + sentence
            else:
                if not current_chunk:
                    chunk_start = char_position
                current_chunk += " " + sentence if current_chunk else sentence

            char_position += len(sentence) + 1

        if current_chunk.strip():
            chunks.append(
                Chunk(
                    content=current_chunk.strip(),
                    chunk_index=start_index + len(chunks),
                    source_file=page.source_file,
                    page_number=page.page_number,
                    section_title=page.section_title,
                    start_char=chunk_start,
                    end_char=chunk_start + len(current_chunk),
                )
            )

        return chunks

    def _split_sentences(self, text: str) -> list[str]:
        import re

        sentences = re.split(r"(?<=[.!?])\s+", text)
        return [s for s in sentences if s.strip()]
