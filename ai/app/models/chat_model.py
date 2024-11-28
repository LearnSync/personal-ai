from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.enums.chat import ERole


class ChatMessageResponse(BaseModel):
    message_id: str
    role: ERole
    content: str


class ChatSessionResponse(BaseModel):
    session_id: str
    session_name: str
    archived: bool
    favorite: bool
    created_at: datetime
    messages: List[ChatMessageResponse]