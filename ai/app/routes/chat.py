from datetime import datetime
from typing import AsyncGenerator, List, Optional, Type

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.schema import ChatSession, ChatMessage
from app.enums.chat import ERole
from app.models.request import ChatRequest
from app.models.response import ChatSessionResponse, ChatMessageResponse
from app.services.ai import AIService

# Initializing Router
router = APIRouter()


@router.post("/generate")
async def generate(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Generate an AI response for a chat session, save the full response, and stream it back to the client.
    """
    try:
        session_id = request.session_id
        messages = request.messages
        model = request.model
        variant = request.variant
        api_key = request.api_key

        # Check if session exists or create a new one
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
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

        # Add or Update User Messages in the Database
        for message in messages:
            existing_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()

            # Find if the current message already exists in the database
            existing_message = next((m for m in existing_messages if m.message_id == message.message_id), None)

            if existing_message:
                # Update existing message
                existing_message.content = message.content
                existing_message.role = message.role
            else:
                # Add new message
                new_message = ChatMessage(
                    session_id=session_id,
                    message_id=message.message_id,
                    role=message.role,
                    content=message.content,
                    created_at=datetime.now(),
                )
                db.add(new_message)
        db.commit()

        async def generate_response() -> AsyncGenerator[str, None]:
            full_text = ""
            try:
                # Stream AI response parts
                for part in AIService.generate_ai_response(
                        messages=messages,
                        model=model,
                        variant=variant,
                        api_key=api_key):
                    full_text += part
                    yield part

                new_message = ChatMessage(
                    session_id=chat_session.session_id,
                    message_id=f"msg_{datetime.now()}",
                    role=ERole.ASSISTANT,
                    content=full_text,
                    created_at=datetime.now(),
                )
                db.add(new_message)
                db.commit()

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error during AI response generation: {str(e)}")

        return StreamingResponse(generate_response(), media_type="application/json")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@router.get("/chat/{session_id}", response_model=ChatSessionResponse)
def get_conversation(session_id: str, db: Session = Depends(get_db)):
    """
    Fetch all chat messages for a given session.
    """
    try:
        # Fetch the chat session
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
            raise HTTPException(
                status_code=404, detail=f"Chat session with ID {session_id} not found."
            )

        # Fetch all messages for the session
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
            .all()
        )

        # Construct the response
        response = ChatSessionResponse(
            session_id=chat_session.session_id,
            session_name=chat_session.session_name,
            archived=chat_session.archived,
            favorite=chat_session.favorite,
            created_at=chat_session.created_at,
            messages=[
                ChatMessageResponse(
                    message_id=message.message_id,
                    role=message.role,
                    content=message.content,
                )
                for message in messages
            ]
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching conversation: {str(e)}")

@router.get("/chat/all")
def get_chat_sessions(
        archived: bool = False,
        favorite: bool = False,
        start_date: Optional[datetime] = Query(None, description="Filter by start date"),
        end_date: Optional[datetime] = Query(None, description="Filter by end date"),
        db: Session = Depends(get_db)
) -> List[Type[ChatSession]]:
    """
    Fetch all chat sessions, optionally filtered by archived or favourite status, and within a date range.
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


@router.post("/chat/{session_id}/update")
def bookmark_and_archive_chat(
    session_id: str,
    archived: bool = False,
    favorite: bool = False,
    db: Session = Depends(get_db)
):
    """
    Bookmark or archive a chat session by its ID.
    """
    try:
        chat_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()

        if not chat_session:
            raise HTTPException(status_code=404, detail=f"Chat session with ID {session_id} not found.")

        # Update session properties
        chat_session.archived = archived
        chat_session.favorite = favorite
        db.commit()
        db.refresh(chat_session)

        return {"detail": "Chat session updated successfully.", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating chat session: {str(e)}")
