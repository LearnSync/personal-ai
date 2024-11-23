from typing import List, Optional

from langchain_chroma import Chroma
from langchain_core.documents import Document
from openai.types import Embedding

# Default database directory for Chroma persistence
DEFAULT_DB_DIRECTORY = "./chroma_db"
DEFAULT_COLLECTION_NAME = "local-first-db"

def insert_documents(
    splits: List[Document],
    embedding: Embedding,
    collection_name:str = DEFAULT_COLLECTION_NAME,
    persist_directory: str = DEFAULT_DB_DIRECTORY
) -> None:
    """
    Inserts a list of documents into a Chroma collection.

    Args:
        splits (List[Document]): The documents to be inserted.
        embedding (Embedding): The embedding model to use.
        collection_name (str): The name of the Chroma collection.
        persist_directory (str): Directory to persist the database.

    Raises:
        ValueError: If the splits or embedding is invalid.
    """
    if not splits:
        raise ValueError("The 'splits' parameter must contain at least one Document.")
    if not embedding:
        raise ValueError("An embedding model is required.")

    try:
        store = Chroma.from_documents(
            collection_name=collection_name,
            documents=splits,
            embedding=embedding,
            persist_directory=persist_directory
        )
        store.persist()  # Ensure data is saved
        print(f"Successfully inserted {len(splits)} documents into collection '{collection_name}'.")
    except Exception as e:
        raise RuntimeError(f"Failed to insert documents into collection '{collection_name}': {e}")