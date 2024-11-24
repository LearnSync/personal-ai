from typing import List, Optional

from langchain_community.embeddings import VertexAIEmbeddings
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_openai import OpenAIEmbeddings

from app.enums.ai import EAIModel, EAIEmbedding


def generate_embeddings(
    splits: List[Document],
    model: EAIEmbedding = EAIEmbedding.OLLAMA_NOMIC,
    openai_api_key: Optional[str] = None,
    gemini_api_key: Optional[str] = None,
) -> List[List[float]]:
    """
    Generates embeddings for the given document splits using the specified embedding model.

    Args:
        splits (List[Document]): The document splits to embed.
        model (EAIEmbedding): The embedding model to use. Defaults to OLLAMA_NOMIC.
        openai_api_key (Optional[str]): OpenAI API key for OpenAIEmbeddings (required if using an OpenAI model).
        gemini_api_key (Optional[str]): Google Gemini API key for VertexAIEmbeddings (required if using a Gemini model).

    Returns:
        List[List[float]]: A list of embeddings for the document splits.

    Raises:
        ValueError: If required parameters are missing or an unsupported model is provided.
        RuntimeError: If embedding model initialization or generation fails.
    """
    if not splits:
        raise ValueError("The 'splits' parameter must contain at least one Document.")


    # Determine the appropriate embedding model
    try:
        if model in {EAIEmbedding.OLLAMA_NOMIC, EAIEmbedding.OLLAMA_MXBAI}:
            embeddings = OllamaEmbeddings(model=model)
        elif model in {
            EAIEmbedding.OPENAI_TEXT_EMBEDDING_3_LARGE,
            EAIEmbedding.OPENAI_TEXT_EMBEDDING_3_SMALL,
            EAIEmbedding.OPENAI_TEXT_EMBEDDING_ADA_002,
        }:
            if not openai_api_key:
                raise ValueError("OpenAI API key is required for OpenAIEmbeddings.")
            embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        elif model == EAIEmbedding.GEMINI_TEXT_EMBEDDING_004:
            if not gemini_api_key:
                raise ValueError("Google Gemini API key is required for VertexAIEmbeddings.")
            embeddings = VertexAIEmbeddings(api_key=gemini_api_key)
        else:
            raise ValueError(
                f"Unsupported model: {model}. Supported models are: OLLAMA, OPENAI, GEMINI."
            )
    except Exception as e:
        raise RuntimeError(f"Failed to initialize the embedding model: {e}")

    # Generate embeddings for the document splits
    try:
        document_contents = [split.page_content for split in splits]
        document_embeddings = embeddings.embed_documents(document_contents)
    except Exception as e:
        raise RuntimeError(f"Failed to generate embeddings: {e}")

    return document_embeddings
