from pydantic import BaseModel, Field
from typing import Optional, List

from app.enums.ai import EAIModel



class AiProvider(BaseModel):
    """
    Schema for individual AI provider configurations.
    """
    api_key: str
    model: EAIModel
    variant: str
    max_token: Optional[int] = Field(None, description="Maximum token limit")


class ApiConfigRequest(BaseModel):
    """
    Schema for the API configuration request.
    """
    anthropic: Optional[List[AiProvider]] = Field(None, description="Anthropic API configurations")
    gemini: Optional[List[AiProvider]] = Field(None, description="Gemini API configurations")
    openai: Optional[List[AiProvider]] = Field(None, description="OpenAI API configurations")
    ollama: Optional[List[AiProvider]] = Field(None, description="Ollama API configurations")
    local: Optional[List[AiProvider]] = Field(None, description="Local model API configurations")
    embedding: Optional[List[AiProvider]] = Field(None, description="Embedding model API configurations")
