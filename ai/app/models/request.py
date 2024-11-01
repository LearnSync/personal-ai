from pydantic import BaseModel
from typing import List, Dict, Optional

class PromptRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: Optional[str] = None     # Example: 'openai'
    variant: Optional[str] = None   # Example: 'openai:gpt-3.5-turbo'
    api_key: Optional[str] = None   # API Key for OpenAI/Claud, not required for Local LLMs
