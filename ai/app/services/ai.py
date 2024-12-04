from typing import List, Dict, Optional, Generator, AsyncGenerator

from langchain_community.llms import OpenAI, Anthropic, Ollama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models import BaseChatModel
from langchain_core.output_parsers import StrOutputParser

from app.enums.ai import EAIModel
from app.enums.topic import ETopic
from app.models.chat_model import ChatMessageResponse
from app.utils.helpers import build_prompt_from_messages


class AIService:
    """
    Service for generating AI responses using various LLM providers (Ollama, OpenAI, Anthropic).
    """

    @staticmethod
    def select_llm(
        model: Optional[str],
        variant: Optional[str],
        api_key: Optional[str]
    ) -> BaseChatModel:
        """
        Select and configure the appropriate LLM based on the provided model and variant.

        Args:
            model (Optional[str]): Model name or identifier.
            variant (Optional[str]): Specific variant of the model (e.g., version).
            api_key (Optional[str]): API key for external models like OpenAI or Anthropic.

        Returns:
            object: Configured LLM instance.

        Raises:
            ValueError: If a required parameter is missing or an unsupported model is specified.
        """
        if model and model.lower() in {EAIModel.OLLAMA, EAIModel.LOCAL}:
            return Ollama(model=variant)
        elif model and model.lower().startswith(str(EAIModel.OPENAI)):
            if not api_key:
                raise ValueError("API key must be provided for OpenAI.")
            return OpenAI(model=model, openai_api_key=api_key)  # TODO: Pending Testing
        elif model and model.lower().startswith(str(EAIModel.ANTHROPIC)):
            if not api_key:
                raise ValueError("API key must be provided for Anthropic.")
            return Anthropic(model=model, api_key=api_key)  # TODO: Pending Testing
        elif model and model.lower().startswith(str(EAIModel.GEMINI)):
            if not api_key:
                raise ValueError("API key must be provided for Gemini")
            return ChatGoogleGenerativeAI(
                model = variant,
                api_key = api_key
            )
        return Ollama(model=variant)

    @staticmethod
    def generate_ai_response(
        model: Optional[str],
        variant: Optional[str],
        api_key: Optional[str],
        messages: List[ChatMessageResponse],
        topic: Optional[ETopic] = ETopic.GENERAL
    ) -> Generator[str,None, None]:
        """
        Generate AI responses from a series of input messages using a specified LLM model.

        Args:
            messages (List[Dict[str, str]]): List of dictionaries containing 'role' and 'content'.
            model (Optional[str]): LLM model name or identifier.
            variant (Optional[str]): Specific variant of the model (e.g., version).
            api_key (Optional[str]): API key for external models.
            topic (Optional[ETopic]): Contextual topic for prompt enhancement.

        Yields:
            str: Generated response chunks.

        Raises:
            ValueError: For invalid configurations or response structure issues.
        """
        if not messages or not isinstance(messages, list):
            raise ValueError("`messages` must be a non-empty list of ChatMessageResponse objects.")

        try:
            formatted_messages = messages
            if model and model.startswith(EAIModel.GEMINI):  # Adjust if `EAIModel.GEMINI` is used
                formatted_messages = [
                    {"role": msg.role, "parts": msg.content} for msg in messages
                ]

            prompt = build_prompt_from_messages(messages, topic)
            output_parser = StrOutputParser()
            llm = AIService.select_llm(model, variant, api_key)

            if not llm:
                raise ValueError(f"Invalid model configuration: {model}, {variant}")

            # Chain the prompt, LLM, and output parser
            chain = prompt | llm | output_parser

            response = chain.stream({"messages": formatted_messages, "topic": topic})

            if not response:
                raise ValueError("Empty response received from the LLM chain.")
        
            for chunk in response:
                yield chunk
        except ValueError as ve:
            print(f"Configuration Error: {ve}")
            raise ve
        except TypeError as te:
            print(f"TypeError while streaming response: {te}")
            raise ValueError("Invalid response structure from the LLM chain.") from te
        except Exception as e:
            print(f"Unexpected Error: {e}")
            raise RuntimeError("An unexpected error occurred while generating the response.") from e

    @staticmethod
    async def generate_title(
            model: str,
            variant: Optional[str],
            api_key: Optional[str],
            messages: List[ChatMessageResponse]
    ) -> str:
        """
        Generate a title based on the conversation messages.

        Args:
            model (str): Model name or identifier.
            variant (Optional[str]): Specific variant of the model.
            api_key (Optional[str]): API key for external models.
            messages (List[ChatMessageResponse]): List of chat messages.

        Returns:
            str: A generated title for the conversation.
        """
        prompt = build_prompt_from_messages(messages, ETopic.TITLE)
        output_parser = StrOutputParser()
        llm = AIService.select_llm(model, variant, api_key)
        if not llm:
            raise ValueError(f"Invalid model configuration: {model}, {variant}")

        # Chain the prompt, LLM, and output parser
        chain = prompt | llm | output_parser

        response = chain.invoke({"messages": messages, "topic": ETopic.TITLE})

        if not response:
            raise ValueError("Empty response received from the LLM chain.")
        return response.strip()

    @staticmethod
    def summarise_messages(
            model: str,
            variant: Optional[str],
            api_key: Optional[str],
            messages: List[ChatMessageResponse]
    ) -> str:
        """
        Summarise a list of messages into one concise response.

        Args:
            model (str): Model name or identifier.
            variant (Optional[str]): Specific variant of the model.
            api_key (Optional[str]): API key for external models.
            messages (List[ChatMessageResponse]): List of chat messages.

        Returns:
            str: A summarised version of the messages.
        """
        prompt = build_prompt_from_messages(messages, ETopic.SUMMARIZE)
        output_parser = StrOutputParser()
        llm = AIService.select_llm(model, variant, api_key)
        if not llm:
            raise ValueError(f"Invalid model configuration: {model}, {variant}")

        # Chain the prompt, LLM, and output parser
        chain = prompt | llm | output_parser

        response = chain.invoke({"messages": messages, "topic": ETopic.SUMMARIZE})

        if not response:
            raise ValueError("Empty response received from the LLM chain.")
        return response.strip()