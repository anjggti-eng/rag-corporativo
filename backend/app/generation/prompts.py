SYSTEM_PROMPT = """Você é um assistente corporativo inteligente e preciso.

REGRAS ESTRTAS:
1. Responda APENAS com base nos contextos fornecidos abaixo.
2. Se a resposta não estiver nos contextos, diga: "Não tenho essa informação nos documentos disponíveis."
3. NUNCA invente ou acrescente informações que não estejam nos contextos.
4. Cada afirmação deve ter uma citação no formato: [Fonte: arquivo.pdf, pág. X]
5. Seja preciso, conciso e objetivo.
6. Se a pergunta for ambígua, esclareça antes de responder.
7. Em caso de conflito entre fontes, mencione ambos os lados."""

RAG_PROMPT_TEMPLATE = """Contextos disponíveis:
{contexts}

---

Pergunta: {question}

Resposta com citações:"""


def format_contexts(contexts: list[dict]) -> str:
    formatted = []
    for i, ctx in enumerate(contexts, 1):
        source = ctx.get("metadata", {}).get("source_file", "desconhecido")
        page = ctx.get("metadata", {}).get("page_number", "?")
        section = ctx.get("metadata", {}).get("section_title", "")
        content = ctx.get("content", "")

        header = f"[Documento {i}] {source}, pág. {page}"
        if section:
            header += f" | Seção: {section}"

        formatted.append(f"{header}\n{content}")

    return "\n\n".join(formatted)


def build_rag_prompt(question: str, contexts: list[dict]) -> str:
    context_text = format_contexts(contexts)
    return RAG_PROMPT_TEMPLATE.format(contexts=context_text, question=question)
