from fastapi import APIRouter
from langchain.embeddings import Embeddings
from langchain.vectorstores import ObjectBoxVectorStore
from app.routes.route import router
from typing import List
from app.database.chat import ChatMessage


@router.get("/chat/?search={search_string}")
def search_chat(chat_session_id: int, query: str) -> List[ChatMessage]:
    """
    Search chat messages across all sessions for the user based on the query using similarity search.
    """
    # Embedding generation
    query_embedding = Embeddings().embed_query(query)

    # Search in the vector store
    results = ObjectBoxVectorStore().similarity_search(chat_session_id=chat_session_id, query_embedding=query_embedding)

    return results
