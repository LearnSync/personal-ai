from typing import List

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)


def split_documents(loaded_documents: List[Document]) -> List[Document]:
    """
    Splits the loaded documents into smaller chunks.

    Args:
        loaded_documents (List[Document]): A list of Document objects to be split.

    Returns:
        List[Document]: A list of split Document objects.
    """
    split_docs = []
    for document in loaded_documents:
        chunks = text_splitter.split_documents([document])
        split_docs.extend(chunks)

    return split_docs
