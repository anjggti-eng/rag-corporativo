from openai import OpenAI
from loguru import logger

from app.config import settings


class LLMClient:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = OpenAI(api_key=settings.openai_api_key)
        return self._client

    def generate(
        self,
        prompt: str,
        system_prompt: str = "",
        temperature: float | None = None,
        max_tokens: int = 2048,
    ) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.client.chat.completions.create(
            model=settings.llm_model,
            messages=messages,
            temperature=temperature if temperature is not None else settings.llm_temperature,
            max_tokens=max_tokens,
        )

        content = response.choices[0].message.content
        logger.debug(f"LLM response: {len(content)} chars")
        return content
