from typing import List, Optional

from app.services.document_processing.embeddings import generate_embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.enums.ai import EAIModel, EAIEmbedding

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)


def split_text_and_generate_embeddings(
    text: str,
    model: EAIEmbedding = EAIEmbedding.OLLAMA_NOMIC,
    openai_api_key: Optional[str] = None,
    gemini_api_key: Optional[str] = None,
) -> List[List[float]]:
    """
    Splits the input text into appropriate chunks and generates embeddings for each chunk.

    Args:
        text (str): The input text to split and process.
        model (EAIModel): The embedding model to use (OLLAMA, OPENAI, GEMINI).
        openai_api_key (Optional[str]): OpenAI API key for OpenAIEmbeddings.
        gemini_api_key (Optional[str]): Google Gemini API key for VertexAIEmbeddings.

    Returns:
        List[List[float]]: A list of embeddings for the text chunks.

    Raises:
        ValueError: If the input text is empty or an unsupported model is specified.
        RuntimeError: If embedding generation fails.
    """
    if not text:
        raise ValueError("Input text cannot be empty.")


    # Split the text into chunks
    splits = text_splitter.split_text(text)

    # Create Document objects for each chunk
    documents = [Document(page_content=chunk) for chunk in splits]

    # Generate embeddings for the chunks
    embeddings = generate_embeddings(
        splits=documents,
        model=model,
        openai_api_key=openai_api_key,
        gemini_api_key=gemini_api_key,
    )

    return embeddings
