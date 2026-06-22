<div align="center">

# RAG Corporativo

### Sistema de Recuperacao Hibrida com Avaliacao Integrada

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Ragas](https://img.shields.io/badge/Ragas-0.2-FF6B35?style=for-the-badge&logo=python&logoColor=white)](https://docs.ragas.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**Pergunte qualquer coisa sobre seus documentos. O sistema busca, compreende e responde com citacoes exatas — sem alucinacoes.**

</div>

---

## O Problema

Bots corporativos tradicionais **inventam respostas**. Um RAG basico ("indexar e perguntar") nao resolve porque:

- Busca vetorial sozinha **falha em nomes proprios e codigos**
- Sem re-ranking, o LLM recebe **documentos irrelevantes**
- Sem citacoes, **nao da para verificar** se a resposta e real
- Sem avaliacao, **voce nao sabe** quando o bot esta mentindo

## A Solucao

Um pipeline completo de **4 etapas** com validacao rigorosa:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   INGESTAO             RECUPERACAO           GERACAO            AVALIACAO   │
│                                                                             │
│   PDF, DOCX, TXT       Vetorial + BM25       GPT-4o-mini        RAGAS      │
│   ↓                    ↓                     ↓                  ↓          │
│   Chunking Semantico   RRF Fusion            Citacoes           Faithful.  │
│   512 tokens           Re-ranking            [Fonte: pag.12]    Relevancia │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Por que Ragas e Essencial?

**Ragas (Retrieval Augmented Generation Assessment)** e o framework de avaliacao que transforma um bot de "achismo" em um sistema confiavel e auditavel.

### O problema sem avaliacao

Sem Ragas, voce envia uma pergunta e recebe uma resposta. Mas como saber se:
- A resposta foi realmente encontrada nos documentos?
- O LLM nao inventou informacoes?
- Os documentos recuperados sao relevantes?

**Resposta: nao da.** E e por isso que 90% dos bots corporativos falham em producao.

### O que Ragas mede

| Metrica | O que verifica | Meta | Alerta |
|:--------|:---------------|:-----|:-------|
| **Faithfulness** | A resposta e derivada APENAS do contexto recuperado? | > 0.8 | Se < 0.8, o LLM esta inventando |
| **Answer Relevancy** | A resposta atende a pergunta original? | > 0.7 | Se < 0.7, a busca falhou |
| **Context Precision** | Os documentos recuperados contem a resposta? | > 0.7 | Se < 0.7, o ranking e ruim |

### Como Ragas funciona

```
┌─────────────────────────────────────────────────────────────────┐
│                    PIPELINE DE AVALIACAO                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Pergunta: "Qual e a politica de reembolso?"                   │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   RESPOSTA LLM  │    │  CONTEXTOS      │                    │
│  │                 │    │  RECUPERADOS    │                    │
│  │  "Reembolso em  │    │  [doc1] "...    │                    │
│  │   30 dias..."   │    │  [doc2] "...    │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                             │
│           └──────────┬───────────┘                             │
│                      ▼                                         │
│           ┌─────────────────────┐                              │
│           │   LLM COMO JUIZ    │                              │
│           │                     │                              │
│           │  "A resposta usa   │                              │
│           │   informacoes do   │                              │
│           │   contexto?"       │                              │
│           └──────────┬──────────┘                              │
│                      ▼                                         │
│           ┌─────────────────────┐                              │
│           │    SCORE: 0.92     │                              │
│           │    STATUS: PASS    │                              │
│           └─────────────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Exemplo real

**Pergunta:** "Qual o prazo para reembolso?"

**Sem Ragas:**
> "O prazo e de 60 dias." (SEM CITACAO)
>
> *Nao tem como saber se isso e verdade.*

**Com Ragas:**
> "O prazo e de 30 dias [Fonte: politica-reembolso.pdf, pag. 12]"
>
> **Faithfulness: 0.95** | **Relevancy: 0.88** | **Status: PASS**
>
> *Resposta verificavel e auditavel.*

---

## Metricas de Avaliacao em Detalhe

### Faithfulness (Fidelidade)

Mede se **todas** as afirmacoes da resposta sao suportadas pelo contexto recuperado.

```
Faithfulness = (Afirmacoes suportadas pelo contexto) / (Total de afirmacoes)
```

**Exemplo:**
- Resposta: "Reembolso em 30 dias para funcionarios efetivos"
- Contexto: "...prazo de 30 dias corridos..."
- **Score: 0.90** (parcialmente suportado - "efetivos" nao esta no contexto)

### Answer Relevancy (Relevancia da Resposta)

Mede se a resposta atende **diretamente** a pergunta feita.

```
Relevancy = similaridade_semantica(pergunta, resposta)
```

**Exemplo:**
- Pergunta: "Qual o prazo de reembolso?"
- Resposta: "O reembolso e feito em 30 dias"
- **Score: 0.88** (alta relevancia)

### Context Precision (Precisao do Contexto)

Mede se os documentos recuperados **contem realmente** a informacao necessaria.

```
Precision = (Docs relevantes recuperados) / (Total de docs recuperados)
```

**Exemplo:**
- Top 5 documentos recuperados
- 4 contem informacoes sobre reembolso
- **Score: 0.80**

---

## Configuracao do Avaliacao

### No Frontend

A avaliacao roda automaticamente apos cada resposta do chat:

```
1. Usuario faz pergunta
2. RAG retorna resposta + fontes
3. Botao "Avaliar com Ragas" aparece
4. Clique retorna: Faithfulness, Relevancy, Status
```

### Na API

```bash
# Avaliar uma resposta
curl -X POST http://localhost:8000/api/eval \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Qual a politica de reembolso?",
    "answer": "Reembolso em 30 dias [Fonte: politica.pdf, pag. 12]",
    "contexts": ["A politica permite reembolso em ate 30 dias corridos"],
    "ground_truth": "30 dias"
  }'
```

**Resposta:**
```json
{
  "faithfulness": 0.92,
  "answer_relevancy": 0.88,
  "context_precision": 0.85,
  "passed": true,
  "details": "Faithfulness: 0.920 [PASS]\nAnswer Relevancy: 0.880 [PASS]"
}
```

---

## Funcionalidades

| Recurso | Descricao |
|:--------|:----------|
| **Busca Hibrida** | Fusao de busca vetorial (semantica) + BM25 (lexicais) com Reciprocal Rank Fusion |
| **Re-ranking** | Modelo bge-reranker reordena documentos por relevancia real antes do LLM |
| **Citacoes Obrigatorias** | Cada afirmacao referencia [Fonte: arquivo.pdf, pag. X] |
| **Avaliacao Ragas** | Metricas automaticas de Faithfulness e Answer Relevancy |
| **Chunking Semantico** | Divisao inteligente preservando contexto (512 tokens, overlap 15%) |
| **Upload Drag & Drop** | Interface intuitiva para upload de documentos |
| **Tema SwiftUI** | Design limpo e moderno inspirado na Apple |

---

## Stack Tecnologica

<div align="center">

| Camada | Tecnologia | Funcao |
|:------:|:-----------|:-------|
| Backend | **FastAPI** | Backend assincrono de alta performance |
| LLM | **GPT-4o-mini** | Geracao com citacoes obrigatorias |
| Vector DB | **ChromaDB** | Vector store com busca cosine |
| Embeddings | **bge-small-en** | Embeddings 384-dim leves e rapidos |
| Retrieval | **Hybrid RRF** | Fusao vetorial + lexical com re-ranking |
| Avaliacao | **Ragas** | Avaliacao automatica de faithfulness |
| Frontend | **Next.js 15** | Frontend React com App Router |
| Estilo | **Tailwind CSS** | Estilizacao utility-first |

</div>

---

## Inicio Rapido

### Pre-requisitos

- Python 3.11+
- Node.js 18+
- Chave API OpenAI

### 1. Clone o repositorio

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

| Pagina | URL |
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

| Metodo | Rota | Descricao |
|:------:|:-----|:----------|
| `GET` | `/health` | Status do sistema |
| `POST` | `/api/ingest` | Upload e indexacao de documentos |
| `POST` | `/api/chat` | Query RAG com resposta + citacoes |
| `GET` | `/api/documents` | Lista documentos indexados |
| `POST` | `/api/eval` | Avaliacao Ragas de uma resposta |
| `DELETE` | `/api/documents` | Remove todos os documentos |

### Exemplo de Request

```bash
# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Qual e a politica de reembolso?"}'
```

---

## Arquitetura Detalhada

```
┌──────────────────────────────────────────────────────────────────┐
│                        FLUXO DE DADOS                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  PDF    │    │ Extractor│    │ Chunker  │    │Embeddings│   │
│  │  DOCX   │───▶│ PyMuPDF  │───▶│Sematico  │───▶│bge-small │   │
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
│  │  │  (semantica) │    │ (lexicais)   │                   │    │
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
│  │  "Cada afirmacao deve ter: [Fonte: arquivo, pag. X]"   │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │              RAGAS EVALUATION ENGINE                    │    │
│  │                                                         │    │
│  │  ┌─────────────────┐  ┌─────────────────┐              │    │
│  │  │  Faithfulness   │  │Answer Relevancy │              │    │
│  │  │                 │  │                 │              │    │
│  │  │  LLM como juiz  │  │ Similaridade    │              │    │
│  │  │  verifica se    │  │ semantica entre │              │    │
│  │  │  cada afirmacao │  │ pergunta e      │              │    │
│  │  │  tem suporte    │  │ resposta        │              │    │
│  │  │  no contexto    │  │                 │              │    │
│  │  └────────┬────────┘  └────────┬────────┘              │    │
│  │           │                    │                       │    │
│  │           └─────────┬──────────┘                       │    │
│  │                     ▼                                  │    │
│  │           ┌─────────────────┐                          │    │
│  │           │  SCORE FINAL    │                          │    │
│  │           │                 │                          │    │
│  │           │  Faith: 0.92   │                          │    │
│  │           │  Rel:   0.88   │                          │    │
│  │           │  PASS/FAIL     │                          │    │
│  │           └─────────────────┘                          │    │
│  │                                                         │    │
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
│   │   ├── ingestion/              # Extracao e chunking
│   │   ├── retrieval/              # Busca hibrida + re-ranking
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

## Contribuicao

Contribuicoes sao bem-vindas! Abra uma issue ou envie um pull request.

---

## Licenca

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Feito com**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Ragas](https://img.shields.io/badge/Ragas-FF6B35?style=for-the-badge&logo=python&logoColor=white)

</div>
