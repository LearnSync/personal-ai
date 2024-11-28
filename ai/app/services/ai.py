from typing import List, Dict, Optional, Generator

from langchain_community.llms import OpenAI, Anthropic, Ollama
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
        else:
            return Ollama(model=variant)  # Default Model

    @staticmethod
    def generate_ai_response(
        messages: List[ChatMessageResponse],
        model: Optional[str],
        variant: Optional[str],
        api_key: Optional[str],
        topic: Optional[ETopic] = ETopic.GENERAL
    ) -> Generator[str, None, None]:
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
        try:
            # Build the prompt
            prompt = build_prompt_from_messages(messages, topic)
            print(f"Generated Prompt: {prompt}")

            # Initialise output parser
            output_parser = StrOutputParser()

            # Select appropriate LLM
            llm = AIService.select_llm(model, variant, api_key)
            print(f"Selected LLM: {llm}")

            # Chain the prompt, LLM, and output parser
            chain = prompt | llm | output_parser
            print(f"Constructed Chain: {chain}")

            # Stream and yield response chunks
            print("Starting response streaming...")
            response = chain.stream({"messages": messages, "topic": topic})

            if response:
                for chunk in response:
                    print(f"Chunk: {chunk}")
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
