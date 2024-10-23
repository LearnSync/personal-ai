from objectbox.model import Entity, Id
from datetime import datetime


class ChatSession(Entity):
    id: int = Id()  # Unique session identifier
    chat_session_id: int  # Unique Chat Session Id
    is_archived: bool  # Whether the session is archived
    is_favorite: bool  # Whether the session is marked as favorite
    created_at: datetime  # Timestamp of session creation


class ChatMessage(Entity):
    id: int = Id()  # Unique message ID
    session_id: int  # Reference to the ChatSession
    sender: str  # "user" or "ai"
    message: str  # The actual message text
    created_at: datetime  # Timestamp of the message
    embeddings: list[float]  # Embedding vector for similarity search


class PDFDocument(Entity):
    id: int = Id()  # Unique ID for each document
    session_id: int  # Reference to the ChatSession
    file_path: str  # Path to the uploaded file
    uploaded_at: datetime  # When the PDF was uploaded
