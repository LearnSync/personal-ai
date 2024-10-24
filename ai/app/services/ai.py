from typing import List, Dict, AsyncGenerator

from langchain_community.llms import Ollama, OpenAI, Anthropic
from langchain_core.output_parsers import StrOutputParser
from app.utils.helpers import build_prompt_from_messages
from app.enums.ai_provider import AIProvider


class AIService:
    @staticmethod
    async def generate_ai_response(messages: List[Dict[str, str]], model: str = "llama3.2", api_key: str = None) -> AsyncGenerator[str, None]:
        # Create prompt from messages
        prompt = build_prompt_from_messages(messages)
        output_parser = StrOutputParser()

        # Default to llama(this can be set in the UI) if no model is specified
        # for now use llama3.2 later throw an error and redirect the user to setup local llms
        if not model or model.lower() == AIProvider.LLAMA:
            llm = Ollama(model=model)
        elif model.lower().startswith(str(AIProvider.OPENAI)):
            llm = OpenAI(model=model, openai_api_key=api_key)  # TODO: Testing Pending
        elif model.lower().startswith(str(AIProvider.ANTHROPIC)):
            llm = Anthropic(model=model, api_key=api_key)  # TODO: Testing Pending
        else:
            llm =  Ollama(model="llama3.2")

        # Chain the prompt with the LLM and output parser
        chain = prompt | llm | output_parser

        # Stream the response part by part
        for part in chain.stream({"message": messages}):
            yield part
