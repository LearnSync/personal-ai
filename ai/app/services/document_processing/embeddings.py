from typing import List, Optional

from langchain_community.embeddings import OllamaEmbeddings, OpenAIEmbeddings, VertexAIEmbeddings
from langchain_core.documents import Document

from app.enums.ai_provider import AIProvider


def generate_embeddings(
    splits: List[Document],
    model: AIProvider = AIProvider.OLLAMA,
    openai_api_key: Optional[str] = None,
    gemini_api_key: Optional[str] = None,
    ollama_base_url: str = "http://localhost:11434"
) -> List[List[float]]:
    """
    Generates embeddings for the given document splits using the specified embedding model.

    Args:
        model (AIProvider): The embedding model to use. Supports OLLAMA, OPENAI, and GEMINI (VertexAI).
        splits (List[Document]): The document splits to embed.
        openai_api_key (Optional[str]): The OpenAI API key required for OpenAIEmbeddings.
        gemini_api_key (Optional[str]): The Google Gemini API key required for VertexAIEmbeddings.
        ollama_base_url (str): The base URL for Ollama embeddings. Default is "http://localhost:11434".

    Returns:
        List[List[float]]: A list of embeddings for the document splits.

    Raises:
        ValueError: If an unsupported model is specified or required API keys are missing.
        RuntimeError: If embedding generation fails.
    """
    if not splits:
        raise ValueError("The 'splits' parameter must contain at least one Document.")

    # Initialize the embeddings model based on the selected provider
    try:
        if model == AIProvider.OLLAMA:
            embeddings = OllamaEmbeddings(model=model, baseUrl=ollama_base_url)
        elif model == AIProvider.OPENAI:
            if not openai_api_key:
                raise ValueError("OpenAI API key is required for OpenAIEmbeddings.")
            embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        elif model == AIProvider.GEMINI:
            if not gemini_api_key:
                raise ValueError("Google Gemini API key is required for VertexAIEmbeddings.")
            embeddings = VertexAIEmbeddings(api_key=gemini_api_key)
        else:
            raise ValueError(f"Unsupported model: {model}. Supported models are: OLLAMA, OPENAI, GEMINI.")
    except Exception as e:
        raise RuntimeError(f"Failed to initialize the embedding model: {e}")

    # Generate embeddings for the document splits
    try:
        document_embeddings = embeddings.embed_documents([split.page_content for split in splits])
    except Exception as e:
        raise RuntimeError(f"Failed to generate embeddings: {e}")

    return document_embeddings
