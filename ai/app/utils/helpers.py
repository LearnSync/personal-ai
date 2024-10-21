from typing import List, Dict
from langchain_core.prompts import ChatPromptTemplate

def build_prompt_from_messages(messages: List[Dict[str, str]]) -> ChatPromptTemplate:
    return ChatPromptTemplate.from_messages(
        [(msg['role'], msg['content']) for msg in messages]
    )
