from dataclasses import dataclass
from pathlib import Path

import fitz  # PyMuPDF
from docx import Document as DocxDocument


@dataclass
class ExtractedPage:
    content: str
    page_number: int
    source_file: str
    section_title: str = ""


class DocumentExtractor:
    SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt", ".md"}

    def extract(self, file_path: str) -> list[ExtractedPage]:
        path = Path(file_path)
        if path.suffix.lower() not in self.SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported file type: {path.suffix}")

        extractor_map = {
            ".pdf": self._extract_pdf,
            ".docx": self._extract_docx,
            ".txt": self._extract_text,
            ".md": self._extract_text,
        }
        return extractor_map[path.suffix.lower()](file_path)

    def _extract_pdf(self, file_path: str) -> list[ExtractedPage]:
        doc = fitz.open(file_path)
        pages = []
        filename = Path(file_path).name

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text")

            if not text.strip():
                continue

            text = self._clean_text(text)
            section_title = self._detect_section_title(text)

            pages.append(
                ExtractedPage(
                    content=text,
                    page_number=page_num + 1,
                    source_file=filename,
                    section_title=section_title,
                )
            )

        doc.close()
        return pages

    def _extract_docx(self, file_path: str) -> list[ExtractedPage]:
        doc = DocxDocument(file_path)
        filename = Path(file_path).name
        full_text = []

        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text)

        combined = "\n".join(full_text)
        combined = self._clean_text(combined)

        return [
            ExtractedPage(
                content=combined,
                page_number=1,
                source_file=filename,
                section_title=self._detect_section_title(combined),
            )
        ]

    def _extract_text(self, file_path: str) -> list[ExtractedPage]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        filename = Path(file_path).name
        text = self._clean_text(text)

        return [
            ExtractedPage(
                content=text,
                page_number=1,
                source_file=filename,
                section_title=self._detect_section_title(text),
            )
        ]

    def _clean_text(self, text: str) -> str:
        import re

        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
        return text.strip()

    def _detect_section_title(self, text: str) -> str:
        lines = text.split("\n")
        for line in lines[:5]:
            stripped = line.strip()
            if stripped and len(stripped) < 100:
                if stripped.isupper() or stripped.endswith(":"):
                    return stripped
        return ""
