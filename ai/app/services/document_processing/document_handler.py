import os
from typing import List

from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, UnstructuredHTMLLoader, TextLoader, \
    UnstructuredMarkdownLoader, JSONLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain_core.documents import Document


def load_document(file_path: str) -> List[Document]:
    """
    Loads documents from the given file path based on their file type.

    Supports various formats including PDF, DOCX, and text-based files like TXT, MD, JSON, and TS.

    Args:
        file_path (str): The path to the document or directory containing documents.

    Returns:
        List[Document]: A list of loaded Document objects.

    Raises:
        ValueError: If no supported files are found.
    """
    supported_extensions = {".pdf", ".docx", ".doc", ".txt", ".md", ".json", ".ts", ".py", ".html", ".csv", ".png",
                            ".jpg", ".jpeg", ".gif"}
    documents = []

    # Check if the provided path is a file or a directory
    if os.path.isfile(file_path):
        file_paths = [file_path]
    elif os.path.isdir(file_path):
        file_paths = [
            os.path.join(file_path, filename)
            for filename in os.listdir(file_path)
            if any(filename.lower().endswith(ext) for ext in supported_extensions)
        ]
    else:
        raise ValueError(f"The path '{file_path}' is neither a file nor a directory.")

    if not file_paths:
        raise ValueError("No supported files found in the specified path.")

    for path in file_paths:
        file_extension = os.path.splitext(path)[-1].lower()

        try:
            if file_extension == ".pdf":
                loader = PyPDFLoader(path)
            elif file_extension in {".doc", ".docx"}:
                loader = Docx2txtLoader(path)
            elif file_extension == ".html":
                loader = UnstructuredHTMLLoader(file_path)
            elif file_extension == ".md":
                loader = UnstructuredMarkdownLoader(file_path, mode="elements")
            elif file_extension == ".csv":
                loader = CSVLoader(file_path)
            elif file_extension ==  ".json":
                loader = JSONLoader(
                    file_path=file_path,
                    jq_schema='.',
                    text_content=False,
                    json_lines=True
                )
            elif file_extension in {".png", ".jpg", ".jpeg", ".gif"}:
                loader = UnstructuredImageLoader(file_path)
            elif file_extension in {".txt", ".ts", ".py"}:
                loader = TextLoader(path)
            else:
                print(f"Unsupported file type: {path}")
                continue

            documents.extend(loader.load())
        except Exception as e:
            print(f"Error loading file '{path}': {e}")

    return documents
