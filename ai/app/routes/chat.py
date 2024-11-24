from datetime import datetime
from typing import AsyncGenerator, List, Type, Optional

from fastapi import (APIRouter, HTTPException, Depends, Query)
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.services.text_processing.text_to_embeddings import split_text_and_generate_embeddings

from app.database.db import get_db
from app.database.schema import (ChatSession, ChatMessage)
from app.enums.chat import ERole
from app.models.request import ChatRequest
from app.services.ai import AIService

# Initializing Router
router = APIRouter()


from datetime import datetime
from typing import AsyncGenerator
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from .models import ChatSession, ChatMessage, ERole  # Assuming these are imported from your models
from .services import AIService, split_text_and_generate_embeddings  # Assuming these are the services used

router = APIRouter()

@router.post("/generate")
async def generate(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        session_id = request.session_id
        messages = request.messages
        model = request.model
        variant = request.variant
        api_key = request.api_key  # TODO: Decrypt the API key here
        decoded_api_key = api_key  # Placeholder for decryption logic

        # Check if session exists or create a new one
        chat_session = (
            db.query(ChatSession)
            .filter(ChatSession.session_id == session_id)
            .first()
        )

        if not chat_session:
            # Create a new session if not found
            chat_session = ChatSession(
                session_name=request.session_name or "Unknown",
                session_id=session_id,
                archived=False,
                favorite=False,
                created_at=datetime.now(),
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

        # Accumulate the full response text in a local variable within the generator
        async def generate_response() -> AsyncGenerator[str, None]:
            full_text = ""
            try:
                # Generate AI response in a streaming manner
                for part in AIService.generate_ai_response(
                    messages=messages[0],
                    model=model[0],
                    variant=variant[0],
                    api_key=decoded_api_key
                ):
                    full_text += part
                    yield part

                # After streaming is finished, process the full text for embeddings
                embeddings = split_text_and_generate_embeddings(text=full_text)

                # Save the complete response to the database
                new_message = ChatMessage(
                    session_id=chat_session.session_id,
                    message_id=f"msg_{datetime.utcnow().timestamp()}",
                    role=ERole.ASSISTANT,
                    content=full_text,
                    created_at=datetime.now(),
                    embeddings=embeddings,
                )
                db.add(new_message)
                db.commit()

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error during AI response generation: {str(e)}")

        # Return the streaming response
        return StreamingResponse(generate_response(), media_type="application/json")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.get("/chat/all")
def get_chat_sessions(
        archived: bool = False,
        favorite: bool = False,
        start_date: Optional[datetime] = Query(None, description="Filter by start date"),
        end_date: Optional[datetime] = Query(None, description="Filter by end date"),
        db: Session = Depends(get_db)
) -> List[Type[ChatSession]]:
    """
    Fetch all chat sessions, optionally filtered by archived or favorite status,
    and within a date range.
    """
    try:
        query = db.query(ChatSession)
        if archived:
            query = query.filter(ChatSession.archived == True)
        if favorite:
            query = query.filter(ChatSession.favorite == True)
        if start_date:
            query = query.filter(ChatSession.created_at >= start_date)
        if end_date:
            query = query.filter(ChatSession.created_at <= end_date)

        return query.order_by(ChatSession.created_at).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat sessions: {str(e)}")


@router.get("/chat/{session_id}")
def get_conversation(session_id: str, db: Session = Depends(get_db)) -> List[Type[ChatMessage]]:
    """
    Fetch all chat messages for a given session.
    """
    try:
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
            .all()
        )
        if not messages:
            raise HTTPException(
                status_code=404, detail=f"No messages found for session ID: {session_id}"
            )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversation: {str(e)}")