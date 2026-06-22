<div align="center">

# RAG Corporativo

### Sistema de Recuperação Híbrida com Avaliação Integrada

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Pergunte qualquer coisa sobre seus documentos. O sistema busca, compreende e responde com citações exatas — sem alucinações.**

</div>

---

## O Problema

Bots corporativos tradicionais **inventam respostas**. Um RAG básico ("indexar e perguntar") não resolve porque:

- Busca vetorial sozinha **falha em nomes próprios e códigos**
- Sem re-ranking, o LLM recebe **documentos irrelevantes**
- Sem citações, **não dá para verificar** se a resposta é real
- Sem avaliação, **você não sabe** quando o bot está mentindo

## A Solução

Um pipeline completo de **4 etapas** com validação rigorosa:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   📄 INGESTÃO          🔍 RECUPERAÇÃO        🧠 GERAÇÃO        📊 AVALIAÇÃO │
│                                                                             │
│   PDF, DOCX, TXT       Vetorial + BM25       GPT-4o-mini       Ragas       │
│   ↓                    ↓                     ↓                 ↓           │
│   Chunking Semântico   RRF Fusion            Citações          Faithfulness│
│   512 tokens           Re-ranking            [Fonte: pág.12]   Relevância  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades

| Recurso | Descrição |
|:--------|:----------|
| **Busca Híbrida** | Fusão de busca vetorial (semântica) + BM25 (lexicais) com Reciprocal Rank Fusion |
| **Re-ranking** | Modelo bge-reranker reordena documentos por relevância real antes do LLM |
| **Citações Obrigatórias** | Cada afirmação referencia [Fonte: arquivo.pdf, pág. X] |
| **Avaliação Ragas** | Métricas automáticas de Faithfulness e Answer Relevancy |
| **Chunking Semântico** | Divisão inteligente preservando contexto (512 tokens, overlap 15%) |
| **Upload Drag & Drop** | Interface intuitiva para upload de documentos |
| **Tema SwiftUI** | Design limpo e moderno inspirado na Apple |

---

## Stack Tecnológica

<div align="center">

| Camada | Tecnologia | Função |
|:------:|:-----------|:-------|
| ⚡ | **FastAPI** | Backend assíncrono de alta performance |
| 🧠 | **GPT-4o-mini** | Geração com citations obrigatórias |
| 🔍 | **ChromaDB** | Vector store com busca cosine |
| 🎯 | **bge-small-en** | Embeddings 384-dim leves e rápidos |
| 🔄 | **Hybrid RRF** | Fusão vetorial + lexical com re-ranking |
| 📊 | **Ragas** | Avaliação automática de faithfulness |
| 🖥️ | **Next.js 15** | Frontend React com App Router |
| 🎨 | **Tailwind CSS** | Estilização utility-first |

</div>

---

## Início Rápido

### Pré-requisitos

- Python 3.11+
- Node.js 18+
- Chave API OpenAI

### 1. Clone o repositório

```bash
git clone https://github.com/anjggti-eng/rag-corporativo.git
cd rag-corporativo
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

pip install -r requirements.txt
cp .env.example .env
```

Edite `.env` com sua `OPENAI_API_KEY`:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
```

Inicie o servidor:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Acesse

| Página | URL |
|:-------|:----|
| Landing Page | [http://localhost:3000](http://localhost:3000) |
| App (Chat/Upload) | [http://localhost:3000/app](http://localhost:3000/app) |
| API Docs (Swagger) | [http://localhost:8000/docs](http://localhost:8000/docs) |

---

## Docker

```bash
cp backend/.env.example backend/.env
# Edite backend/.env com sua OPENAI_API_KEY

docker-compose up --build
```

---

## API Endpoints

| Método | Rota | Descrição |
|:------:|:-----|:----------|
| `GET` | `/health` | Status do sistema |
| `POST` | `/api/ingest` | Upload e indexação de documentos |
| `POST` | `/api/chat` | Query RAG com resposta + citações |
| `GET` | `/api/documents` | Lista documentos indexados |
| `POST` | `/api/eval` | Avaliação Ragas de uma resposta |
| `DELETE` | `/api/documents` | Remove todos os documentos |

### Exemplo de Request

```bash
# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Qual é a política de reembolso?"}'
```

---

## Métricas de Avaliação

| Métrica | Meta | O que mede |
|:--------|:-----|:-----------|
| **Faithfulness** | > 0.8 | A resposta é derivada apenas do contexto recuperado? |
| **Answer Relevancy** | > 0.7 | A resposta atende à pergunta original? |
| **Context Precision** | > 0.7 | Os documentos recuperados contêm a resposta? |

---

## Arquitetura Detalhada

```
┌──────────────────────────────────────────────────────────────────┐
│                        FLUXO DE DADOS                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  PDF    │    │ Extractor│    │ Chunker  │    │Embeddings│   │
│  │  DOCX   │───▶│ PyMuPDF  │───▶│Semântico │───▶│bge-small │   │
│  │  TXT    │    │          │    │ 512 tok  │    │          │   │
│  └─────────┘    └──────────┘    └──────────┘    └────┬─────┘   │
│                                                       │         │
│                                                       ▼         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    ChromaDB                             │    │
│  │              (Vector Store + Metadados)                 │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  HYBRID RETRIEVAL                       │    │
│  │  ┌──────────────┐    ┌──────────────┐                   │    │
│  │  │ Vector Search│    │  BM25 Search │                   │    │
│  │  │  (semântica) │    │ (lexicais)   │                   │    │
│  │  └──────┬───────┘    └──────┬───────┘                   │    │
│  │         │                   │                            │    │
│  │         └───────┬───────────┘                            │    │
│  │                 ▼                                        │    │
│  │         ┌──────────────┐                                 │    │
│  │         │ RRF Fusion   │                                 │    │
│  │         │ (k=60)       │                                 │    │
│  │         └──────┬───────┘                                 │    │
│  │                ▼                                         │    │
│  │         ┌──────────────┐                                 │    │
│  │         │  Re-ranker   │                                 │    │
│  │         │  bge-base    │                                 │    │
│  │         └──────┬───────┘                                 │    │
│  └────────────────┼─────────────────────────────────────────┘    │
│                   │                                              │
│                   ▼                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              GPT-4o-mini + Prompt                       │    │
│  │  "Responda apenas com base nos contextos fornecidos"   │    │
│  │  "Cada afirmação deve ter: [Fonte: arquivo, pág. X]"   │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 Ragas Evaluation                        │    │
│  │         Faithfulness + Answer Relevancy                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
rag-corporativo/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI server
│   │   ├── config.py               # Settings
│   │   ├── ingestion/              # Extração e chunking
│   │   ├── retrieval/              # Busca híbrida + re-ranking
│   │   ├── generation/             # LLM + prompts
│   │   └── evaluation/             # Ragas metrics
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/                    # Pages (Landing + App)
│   │   ├── components/             # UI Components
│   │   └── lib/                    # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Contribuição

Contribuições são bem-vindas! Abra uma issue ou envie um pull request.

---

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Feito com**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>
