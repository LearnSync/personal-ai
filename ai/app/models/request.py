from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

from app.models.chat_model import ChatMessageResponse


class ChatRequest(BaseModel):
    """
    Represents a request for a chat interaction.
    """
    session_id: str = Field(..., description="Unique identifier for the chat session.")
    messages: List[ChatMessageResponse] = Field(..., description="List of messages exchanged in the chat.")
    session_name: Optional[str] = Field(..., description="Unique identifier for the chat session.")
    response_message_id: str = Field(..., description="Unique identifier for the chat response.")
    model: Optional[str] = Field(
        None, description="The AI model to be used, e.g., 'openai'."
    )
    variant: Optional[str] = Field(
        None, description="Specific variant of the model, e.g., 'openai:gpt-3.5-turbo'."
    )
    api_key: Optional[str] = Field(
        None, description="API key for accessing the model (not required for local models)."
    )

class ContextSearchRequest(BaseModel):
    """
    Represents a request to search for context in the stored chat data.
    """
    query: str = Field(..., description="Search query string.")
    mode: Optional[str] = Field(
        None,
        description=(
            "Search mode, e.g., 'bookmark', 'archived', 'favourite', or 'general'. "
            "If not provided, defaults to a general search."
        )
    )
    start_date: Optional[date] = Field(
        None, description="Start date for filtering search results."
    )
    end_date: Optional[date] = Field(
        None, description="End date for filtering search results."
    )
    topic: Optional[str] = Field(
        None, description="Topic to narrow the search results, e.g., 'code', 'biology', 'finance'."
    )

class AdvancedChatRequest(ChatRequest):
    """
    Extends the ChatRequest to include advanced contextual search capabilities.
    """
    context_search: Optional[ContextSearchRequest] = Field(
        None, description="Optional contextual search parameters to refine the response."
    )
