from datetime import datetime
from typing import List, Optional

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


class UpdateChatSessionRequest(BaseModel):
    rename: Optional[str] = None
    archived: Optional[bool] = None
    favorite: Optional[bool] = None