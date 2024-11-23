from typing import List, Dict, AsyncGenerator, Optional

from langchain_ollama import ChatOllama
from langchain_community.llms import OpenAI, Anthropic
from langchain_core.output_parsers import StrOutputParser

from app.enums.topic import Topic
from app.utils.helpers import build_prompt_from_messages
from app.enums.ai_provider import AIProvider


class AIService:
    @staticmethod
    def generate_ai_response(messages: List[Dict[str, str]], model: Optional[str], variant: Optional[str],
                             api_key: Optional[str], topic:Optional[Topic] = None) -> [str, None]:
        # Create prompt from messages
        prompt = build_prompt_from_messages(messages, topic)
        output_parser = StrOutputParser()

        # Default to llama(this can be set in the UI) if no model is specified
        # for now use llama3.2 later throw an error and redirect the user to setup local llms
        if model and model.lower() == AIProvider.LLAMA:
            llm = ChatOllama(model=variant)
        elif model and model.lower().startswith(str(AIProvider.OPENAI)):
            if api_key is None:
                raise ValueError("API key must be provided for OpenAI.")
            llm = OpenAI(model=model, openai_api_key=api_key)  # TODO: Testing Pending
        elif model and model.lower().startswith(str(AIProvider.ANTHROPIC)):
            if api_key is None:
                raise ValueError("API key must be provided for OpenAI.")
            llm = Anthropic(model=model, api_key=api_key)  # TODO: Testing Pending
        else:
            llm =  ChatOllama(model=variant)

        # Chain the prompt with the LLM and output parser
        chain = prompt | llm | output_parser

        # Stream the response part by part
        for part in chain.stream({"message": messages}):
            yield part
